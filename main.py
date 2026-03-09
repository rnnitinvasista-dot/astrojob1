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

# Version: 1.2.2 - Fix Rahu/Ketu & Nadi Combinations
app = FastAPI(title="Nadi Precision Engine Gold v1.2.2")

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
    latitude: float
    longitude: float
    place: Optional[str] = "Unknown"

class CalculationSettings(BaseModel):
    ayanamsa: Optional[str] = "KP"
    house_system: Optional[str] = "Placidus"
    node_type: Optional[str] = "Mean"

class KundliRequest(BaseModel):
    birth_details: BirthDetails
    calculation_settings: Optional[CalculationSettings] = CalculationSettings()
    prashna_number: Optional[int] = None

def get_engine(settings: CalculationSettings = None):
    node_type = settings.node_type if settings else "Mean"
    ayanamsa = settings.ayanamsa if settings else "KP"
    house_system = settings.house_system if settings else "Placidus"
    return NadiEngine(node_type=node_type, ayanamsa=ayanamsa, house_system=house_system)

@app.post("/api/v1/kp/kundli")
@app.post("/kundli")
def generate_kundli(req: KundliRequest):
    try:
        re = get_engine(req.calculation_settings)
        res = re.calculate_kundli(
            f"{req.birth_details.date_of_birth} {req.birth_details.time_of_birth}",
            req.birth_details.timezone,
            req.birth_details.latitude,
            req.birth_details.longitude,
            horary_number=req.prashna_number
        )
        return res
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

class PrashnaRequest(BaseModel):
    prashna_number: int
    date: str
    time: str
    latitude: float
    longitude: float
    timezone: Optional[str] = "Asia/Kolkata"

@app.post("/api/v1/kp/mixed-prashna")
@app.post("/mixed-prashna")
def mixed_prashna(req: PrashnaRequest):
    try:
        re = get_engine()
        res = re.calculate_kundli(
            f"{req.date} {req.time}",
            req.timezone,
            req.latitude,
            req.longitude,
            horary_number=req.prashna_number
        )
        return res
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

@app.get("/health")
@app.get("/api/v1/kp/health")
def health():
    return {
        "status": "online", 
        "service": "Nadi Precision Engine Gold", 
        "version": "1.2.2-FULL-DASHA"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
