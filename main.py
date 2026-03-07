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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nadi-engine")

app = FastAPI(title="Nadi Precision Engine Gold")

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Nadi Precision Engine Gold starting up...")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = await request.body()
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
    place: Optional[str] = "Unknown"

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

engine_cache = {}

def get_engine(node_type="Mean", ayanamsa="KP", house_system="Placidus"):
    key = (node_type, ayanamsa, house_system)
    if key not in engine_cache:
        engine_cache[key] = NadiEngine(node_type=node_type, ayanamsa=ayanamsa, house_system=house_system)
    return engine_cache[key]

# Pre-warm
get_engine()

@app.get("/")
@app.get("/health")
@app.get("/api/v1/kp/health")
def health():
    return {"status": "online", "service": "Nadi Precision Engine Gold", "version": "1.67-RELATIVEDELTA-FIX"}

prediction_cache = {}

def get_cache_key(req: Union[KundliRequest, MixedPrashnaRequest]):
    if isinstance(req, KundliRequest):
        return f"k_{req.birth_details.date_of_birth}_{req.birth_details.time_of_birth}_{req.birth_details.latitude}_{req.birth_details.longitude}_{req.horary_number}"
    return f"p_{req.date}_{req.time}_{req.latitude}_{req.longitude}_{req.prashna_number}"

@app.post("/api/v1/kp/kundli")
def generate_kundli(req: KundliRequest):
    try:
        key = get_cache_key(req)
        if key in prediction_cache: return prediction_cache[key]
        
        re = get_engine(node_type=req.calculation_settings.node_type, ayanamsa=req.calculation_settings.ayanamsa)
        res = re.calculate_kundli(f"{req.birth_details.date_of_birth} {req.birth_details.time_of_birth}", req.birth_details.timezone, float(req.birth_details.latitude), float(req.birth_details.longitude), horary_number=req.horary_number)
        
        res["metadata"]["place"] = req.birth_details.place
        if len(prediction_cache) > 500: prediction_cache.clear()
        prediction_cache[key] = res
        return res
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/v1/kp/mixed-prashna")
def prashna(req: MixedPrashnaRequest):
    try:
        key = get_cache_key(req)
        if key in prediction_cache: return prediction_cache[key]
        
        re = get_engine()
        res = re.calculate_kundli(f"{req.date} {req.time}", req.timezone, req.latitude, req.longitude, horary_number=req.prashna_number)
        
        if len(prediction_cache) > 500: prediction_cache.clear()
        prediction_cache[key] = res
        return res
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/v1/kp/job-analysis")
def job_analysis(req: KundliRequest):
    # For now, return full kundli as the analysis base
    return generate_kundli(req)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
