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
import logging
from nadi_core import NadiEngine, HIT_MATRIX, SUCCESS_LABELS, HOUSE_JOB_AREAS
from kp_prashna_engine import KPMixedPrashnaEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nadi-engine")

app = FastAPI(title="Nadi Precision Engine Gold")

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Nadi Precision Engine Gold starting up...")
    logger.info(f"NODE_TYPE: Mean, AYANAMSA: KP")

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

class HouseDetail(BaseModel):
    house: int
    is_placed: bool

class Signification(BaseModel):
    planet: str
    level1: List[HouseDetail]
    level2: List[HouseDetail]
    level3: List[HouseDetail]
    total: List[int]
    total_detailed: List[HouseDetail]

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
    horary_number: Optional[int] = None

class MixedPrashnaRequest(BaseModel):
    prashna_number: int
    date: str
    time: str
    latitude: float
    longitude: float
    timezone: str

# Global Engine Cache to avoid repeated initializations
engine_cache = {}

def get_engine(node_type="Mean", ayanamsa="KP", house_system="Placidus"):
    key = (node_type, ayanamsa, house_system)
    if key not in engine_cache:
        engine_cache[key] = NadiEngine(node_type=node_type, ayanamsa=ayanamsa, house_system=house_system)
    return engine_cache[key]

# Initialize the default engine
engine = get_engine(node_type="Mean", ayanamsa="KP")

@app.get("/")
def health_check():
    return {"status": "online", "service": "Nadi Precision Engine Gold", "version": "1.65-KUNDA-FIX"}

@app.get("/health")
def health_check_alias():
    return {"status": "online", "service": "Nadi Precision Engine Gold", "version": "1.63-HIT-THEORY"}

# Global Result Cache for performance
prediction_cache = {}

def get_cache_key(req: KundliRequest):
    return json.dumps({
        "dob": req.birth_details.date_of_birth,
        "tob": req.birth_details.time_of_birth,
        "lat": str(req.birth_details.latitude),
        "lon": str(req.birth_details.longitude),
        "ayanamsa": req.calculation_settings.ayanamsa,
        "horary": req.horary_number
    }, sort_keys=True)

@app.post("/api/v1/kp/kundli")
def generate_kundli(req: KundliRequest):
    try:
        cache_key = get_cache_key(req)
        if cache_key in prediction_cache:
            logger.info("🎯 Cache Hit for Kundli")
            return prediction_cache[cache_key]

        # Pass request data to the engine
        dt_str = f"{req.birth_details.date_of_birth} {req.birth_details.time_of_birth}"
        
        # Coerce lat/lon to float
        lat_val = float(req.birth_details.latitude)
        lon_val = float(req.birth_details.longitude)
        
        # Determine strict settings
        nt = req.calculation_settings.node_type
        requested_ayanamsa = req.calculation_settings.ayanamsa
        request_engine = get_engine(node_type=nt, ayanamsa=requested_ayanamsa, house_system=req.calculation_settings.house_system)
        
        result = request_engine.calculate_kundli(
            dt_str, 
            req.birth_details.timezone,
            lat_val,
            lon_val,
            horary_number=req.horary_number
        )
        
        # Inject place back into metadata for frontend
        result["metadata"]["place"] = req.birth_details.place
        import datetime
        result["metadata"]["server_ts"] = datetime.datetime.now().isoformat()
        
        # Limit cache size simple way
        if len(prediction_cache) > 1000:
            prediction_cache.clear()
        prediction_cache[cache_key] = result
        
        return result
        
    except Exception as e:
        return {"status": "error", "message": f"Engine Error: {str(e)}"}

@app.post("/api/v1/kp/mixed-prashna")
def mixed_prashna(req: MixedPrashnaRequest):
    try:
        # Use the standard NadiEngine
        re = get_engine(node_type="Mean", ayanamsa="KP")
        dt_str = f"{req.date} {req.time}"
        
        result = re.calculate_kundli(
            dt_str, 
            req.timezone,
            req.latitude,
            req.longitude,
            horary_number=req.prashna_number
        )
        return result
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

@app.post("/api/v1/kp/job-analysis")
async def job_analysis(req: KundliRequest):
    try:
        cache_key = "job_" + get_cache_key(req)
        if cache_key in prediction_cache:
            logger.info("🎯 Cache Hit for Job Analysis")
            return prediction_cache[cache_key]

        # 1. Get Base Kundli
        dt_str = f"{req.birth_details.date_of_birth} {req.birth_details.time_of_birth}"
        lat_val = float(req.birth_details.latitude)
        lon_val = float(req.birth_details.longitude)
        
        request_engine = get_engine(node_type=req.calculation_settings.node_type, ayanamsa=req.calculation_settings.ayanamsa, house_system=req.calculation_settings.house_system)
        result = request_engine.calculate_kundli(dt_str, req.birth_details.timezone, lat_val, lon_val, horary_number=req.horary_number)
        
        if result.get("status") == "error":
            return result

        # 2. Process ALL 9 Planets for Gold Nadi
        planet_reports = []
        planet_positions = {p["planet"]: p["house"] for p in result["planets"]}

        for entry in result["nakshatra_nadi"]:
            p_name = entry["planet"]
            p_house = planet_positions.get(p_name)
            
            # Significators
            pl_houses = [s["house"] for s in entry["pl_signified"]]
            nl_houses = [s["house"] for s in entry["nl_signified"]]
            sl_houses = [s["house"] for s in entry["sl_signified"]]
            
            combo_all = set(pl_houses) | set(nl_houses) | set(sl_houses)

            # 4-Scenario Hit Theory Categorization (Page 8)
            has_11 = 11 in combo_all
            has_12 = 12 in combo_all
            
            green_houses = {2, 10, 11}
            blue_houses = {1, 3, 4}
            red_houses = {12}
            
            if has_11 and has_12: # S1
                green_houses.update({6, 7, 9})
                red_houses.update({5, 8})
            elif has_11 and not has_12: # S2
                green_houses.update({5, 6, 7, 8, 9})
            elif not has_11 and has_12: # S3
                red_houses.update({5, 6, 7, 8, 9})
            else: # S4 (Neither)
                green_houses.update({6, 7, 9})
                red_houses.update({5, 8})

            # Identify "Hits" for circling
            def get_hit_house(houses, pos):
                if pos in houses: return pos
                priority = [11, 10, 2, 6, 7, 9, 3, 4, 1, 8, 5, 12]
                for h in priority:
                    if h in houses: return h
                return None

            pl_hit = get_hit_house(pl_houses, p_house)
            nl_hit = get_hit_house(nl_houses, p_house)
            sl_hit = get_hit_house(sl_houses, p_house)

            job_areas = []
            if sl_hit in HOUSE_JOB_AREAS: job_areas.append(f"Primary: {HOUSE_JOB_AREAS[sl_hit]}")
            if nl_hit in HOUSE_JOB_AREAS and nl_hit != sl_hit: job_areas.append(f"Secondary: {HOUSE_JOB_AREAS[nl_hit]}")
            if not job_areas and pl_hit in HOUSE_JOB_AREAS: job_areas.append(f"Focus: {HOUSE_JOB_AREAS[pl_hit]}")

            # Income / Expenses Mapping (Refined Labels)
            inc_label = "Income"
            if 11 in combo_all: inc_label = "Very High Income"
            elif 10 in combo_all: inc_label = "High Income"
            elif len([h for h in combo_all if h in {2, 6, 7, 9}]) >= 2: inc_label = "Medium Income"

            exp_label = "No Significant Loss"
            if 12 in combo_all and (5 in combo_all or 8 in combo_all): exp_label = "High Loss/Exp"
            elif 12 in combo_all: exp_label = "Medium Loss"
            elif 5 in combo_all or 8 in combo_all: exp_label = "Obstacles"

            # Success Rate (Matrix underlying logic)
            nl_matrix_h = nl_hit if nl_hit else 1
            sl_matrix_h = sl_hit if sl_hit else 1
            rate_code = HIT_MATRIX[nl_matrix_h][sl_matrix_h - 1]
            success_rate = SUCCESS_LABELS.get(rate_code, "Medium")

            prediction = {
                "overall_combination": {
                    "good": [h for h in combo_all if h in green_houses],
                    "medium": [h for h in combo_all if h in blue_houses],
                    "bad": [h for h in combo_all if h in red_houses]
                },
                "income_expenses": {
                    "good": inc_label,
                    "bad": exp_label
                },
                "success_rate": success_rate,
                "job_areas": job_areas,
                "hits": {"pl": pl_hit, "nl": nl_hit, "sl": sl_hit}
            }

            planet_reports.append({
                "planet": p_name,
                "star_lord": entry["star_lord"],
                "sub_lord": entry["sub_lord"],
                "pl": pl_houses,
                "nl": nl_houses,
                "sl": sl_houses,
                "prediction": prediction
            })

        # Identify 6th and 10th CSL for the "Top" focus
        csl6_name = next(h["sub_lord"] for h in result["houses"] if h["house_number"] == 6)
        csl10_name = next(h["sub_lord"] for h in result["houses"] if h["house_number"] == 10)

        job_response = {
            "status": "success",
            "csl_focus": {"csl6": csl6_name, "csl10": csl10_name},
            "dasha_info": {
                "dasha": result["dasha"]["current_dasha"],
                "bhukti": result["dasha"]["current_bukthi"],
                "antara": result["dasha"]["current_antara"]
            },
            "reports": planet_reports
        }
        
        if len(prediction_cache) > 1000:
            prediction_cache.clear()
        prediction_cache[cache_key] = job_response
        return job_response
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@app.post("/api/v1/kp/child-analysis")
async def child_analysis(req: KundliRequest):
    try:
        cache_key = "child_" + get_cache_key(req)
        if cache_key in prediction_cache:
            return prediction_cache[cache_key]

        # 1. Get Base Kundli
        dt_str = f"{req.birth_details.date_of_birth} {req.birth_details.time_of_birth}"
        lat_val = float(req.birth_details.latitude)
        lon_val = float(req.birth_details.longitude)
        
        request_engine = get_engine(node_type=req.calculation_settings.node_type, ayanamsa=req.calculation_settings.ayanamsa, house_system=req.calculation_settings.house_system)
        result = request_engine.calculate_kundli(dt_str, req.birth_details.timezone, lat_val, lon_val, horary_number=req.horary_number)
        
        if result.get("status") == "error":
            return result

        # 2. Process ALL 9 Planets for Child Birth
        planet_reports = []
        planet_positions = {p["planet"]: p["house"] for p in result["planets"]}

        from nadi_core import CHILD_BIRTH_GROUPS, ABORTION_GROUPS, IVF_GROUP

        for entry in result["nakshatra_nadi"]:
            p_name = entry["planet"]
            p_house = planet_positions.get(p_name)
            
            # Significators
            pl_houses = [s["house"] for s in entry["pl_signified"]]
            nl_houses = [s["house"] for s in entry["nl_signified"]]
            sl_houses = [s["house"] for s in entry["sl_signified"]]
            
            combo_all = set(nl_houses) | set(sl_houses)

            # Identify "Hits" for Child Birth (NL and SL ONLY)
            def get_child_hit(houses, pos):
                if pos in houses: return pos
                # Priority for Child Birth: Good followed by Bad
                priority = [11, 5, 2, 9, 12, 8, 4, 10, 1, 6, 3, 7]
                for h in priority:
                    if h in houses: return h
                return None

            # User explicitly said: NL and SL for box, DONT see PL
            # Use ONLY "Boxed" (Hit) houses for the final analysis
            nl_hit = get_child_hit(nl_houses, p_house)
            sl_hit = get_child_hit(sl_houses, p_house)
            pl_hit = None # Disabled

            # Analysis strictly based on NL/SL Hits (Boxed elements)
            fertility_res = "Low / No Promise"
            hit_set = {h for h in [nl_hit, sl_hit] if h is not None}
            
            # 1. Childlessness (Bad houses in SL take priority)
            if sl_hit in {1, 4, 8, 10, 12}:
                fertility_res = "Childlessness / No Child"
            # 2. Good Combinations
            elif sl_hit in {2, 5, 9, 11}:
                if nl_hit in {2, 5, 9, 11}:
                    fertility_res = "High Fertility"
                else:
                    fertility_res = "Medium Fertility"
            elif nl_hit in {2, 5, 9, 11}:
                fertility_res = "Low Fertility (Difficulty)"

            # 3. Special Cases
            if sl_hit in {6, 8, 12} and nl_hit in {2, 5, 9, 11}:
                fertility_res = "Risk of Abortion"
            
            if sl_hit == 8 and nl_hit in {2, 5, 11}:
                fertility_res = "Possible Caesarian / IVF"

            prediction = {
                "overall_combination": {
                    "good": [h for h in combo_all if h in {2, 5, 9, 11}],
                    "medium": [h for h in combo_all if h in {1, 3, 7}],
                    "bad": [h for h in combo_all if h in {1, 4, 8, 10, 12}]
                },
                "fertility_report": fertility_res,
                "hits": {"pl": None, "nl": nl_hit, "sl": sl_hit}
            }

            planet_reports.append({
                "planet": p_name,
                "star_lord": entry["star_lord"],
                "sub_lord": entry["sub_lord"],
                "pl": pl_houses,
                "nl": nl_houses,
                "sl": sl_houses,
                "prediction": prediction
            })

        # CSL 5 for child birth focus
        csl5_name = next(h["sub_lord"] for h in result["houses"] if h["house_number"] == 5)

        child_response = {
            "status": "success",
            "csl_focus": {"csl5": csl5_name},
            "dasha_info": {
                "dasha": result["dasha"]["current_dasha"],
                "bhukti": result["dasha"]["current_bukthi"],
                "antara": result["dasha"]["current_antara"]
            },
            "reports": planet_reports
        }
        
        if len(prediction_cache) > 1000:
            prediction_cache.clear()
        prediction_cache[cache_key] = child_response
        return child_response
        
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

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

