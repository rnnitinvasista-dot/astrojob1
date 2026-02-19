from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Set, Tuple, Union
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import os
import traceback
from nadi_core import NadiEngine

app = FastAPI(title="Nadi Precision Engine V5")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = await request.body()
    print(f"\n🔥 422 VALIDATION ERROR 🔥")
    print(f"URL: {request.url}")
    print(f"Body: {body.decode()}")
    print(f"Errors: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": body.decode()},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BirthDetails(BaseModel):
    date_of_birth: str
    time_of_birth: str
    timezone: str
    latitude: Union[float, str]
    longitude: Union[float, str]
    place: Optional[str] = "Unknown" # Optional

class CalculationSettings(BaseModel):
    ayanamsa: str = "KP"
    house_system: str = "Placidus"
    node_type: str = "Mean"

class KundliRequest(BaseModel):
    birth_details: BirthDetails
    calculation_settings: CalculationSettings

# Initialize the Precision Engine
engine = NadiEngine(node_type="Mean", ayanamsa="KP")

@app.post("/api/v1/kp/kundli")
def generate_kundli(req: KundliRequest):
    try:
        # Pass request data to the engine
        dt_str = f"{req.birth_details.date_of_birth} {req.birth_details.time_of_birth}"
        
        # Coerce lat/lon to float
        lat_val = float(req.birth_details.latitude)
        lon_val = float(req.birth_details.longitude)
        
        # Determine strict settings
        nt = req.calculation_settings.node_type
        request_engine = NadiEngine(node_type=nt, ayanamsa="Lahiri", house_system=req.calculation_settings.house_system)
        
        result = request_engine.calculate_kundli(
            dt_str, 
            req.birth_details.timezone,
            lat_val,
            lon_val
        )
        
        # Inject place back into metadata for frontend
        result["metadata"]["place"] = req.birth_details.place
        import datetime
        result["metadata"]["server_ts"] = datetime.datetime.now().isoformat()
        
        return result
        
    except Exception as e:
        return {"status": "error", "message": f"Engine Error: {str(e)}"}

@app.post("/api/v1/kp/job-analysis")
async def job_analysis(req: KundliRequest):
    try:
        # 1. Get Base Kundli
        dt_str = f"{req.birth_details.date_of_birth} {req.birth_details.time_of_birth}"
        lat_val = float(req.birth_details.latitude)
        lon_val = float(req.birth_details.longitude)
        
        # Use existing calculation logic
        request_engine = NadiEngine(node_type=req.calculation_settings.node_type, ayanamsa="Lahiri", house_system=req.calculation_settings.house_system)
        result = request_engine.calculate_kundli(dt_str, req.birth_details.timezone, lat_val, lon_val)
        
        if result.get("status") == "error":
            return result
            
        # 2. Identify 6th and 10th Cuspal Sublords
        try:
            csl6_name = next(h["sub_lord"] for h in result["houses"] if h["house_number"] == 6)
            csl10_name = next(h["sub_lord"] for h in result["houses"] if h["house_number"] == 10)
        except StopIteration:
            return {"status": "error", "message": "Could not find 6th or 10th house sublords in calculation."}
        
        # 3. Extract Significations for these planets
        def get_nadi_entry(p_name):
            try:
                entry = next(e for e in result["nakshatra_nadi"] if e["planet"] == p_name)
                return {
                    "planet": p_name,
                    "pl": [s["house"] for s in entry["pl_signified"]],
                    "nl": [s["house"] for s in entry["nl_signified"]],
                    "sl": [s["house"] for s in entry["sl_signified"]]
                }
            except StopIteration:
                return None

        csl6_data = get_nadi_entry(csl6_name)
        csl10_data = get_nadi_entry(csl10_name)
        
        if not csl6_data or not csl10_data:
            return {"status": "error", "message": f"Missing Nadi data for sublords {csl6_name} or {csl10_name}"}

        prompt_data = {
            "csl6": csl6_data,
            "csl10": csl10_data
        }
        
        # 4. Call AI Service
        from ai_service import AIService
        # Get OpenRouter Key from Environment Variable (Security Best Practice)
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return {"status": "error", "message": "API Key not found. Please set OPENROUTER_API_KEY in Render environment variables."}
            
        ai = AIService(api_key)
        
        analysis = ai.generate_job_analysis(prompt_data)
        
        if "error" in analysis:
            return {"status": "error", "message": f"AI Generation Failed: {analysis['error']}"}
            
        return {
            "status": "success",
            "csl_details": prompt_data,
            "analysis": analysis
        }
        
    except Exception as e:
        error_msg = traceback.format_exc()
        print(f"❌ Analysis Crash:\n{error_msg}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error", 
                "message": f"Server Crash: {str(e)}", 
                "details": error_msg
            }
        )

@app.get("/api/v1/kp/health/ai")
async def health_ai():
    """Diagnostic endpoint to test AI connectivity."""
    try:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return {"status": "error", "message": "Key missing in Env Vars"}
        
        from ai_service import AIService
        ai = AIService(api_key)
        # Very simple test prompt
        test_result = ai.generate_job_analysis({"csl6": {"planet":"Sun","pl":[1],"nl":[2],"sl":[3]}, "csl10": {"planet":"Sun","pl":[1],"nl":[2],"sl":[3]}})
        
        if "error" in test_result:
            return {"status": "api_error", "result": test_result}
            
        return {"status": "success", "message": "AI Connectivity OK", "test_result": test_result}
    except Exception as e:
        return {"status": "crash", "message": str(e), "trace": traceback.format_exc()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


