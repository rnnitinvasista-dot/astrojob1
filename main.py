from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Set, Tuple, Union
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

