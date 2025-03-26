from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from dotenv import load_dotenv
import openai
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("Warning: OPENAI_API_KEY not found in environment variables")

app = FastAPI(title="Treino IA API", description="API para gerar treinos utilizando IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Exercise(BaseModel):
    name: str
    target: str
    recurrence: str
    level: str
    alternatives: List[str]

class Workout(BaseModel):
    name: str
    exercises: List[Exercise]

class TrainingPlanRequest(BaseModel):
    client_id: int
    age: int
    height: int
    body_type: str
    goal: str
    training_days: int
    training_time: int
    experience_level: str
    current_condition: str

class TrainingPlanResponse(BaseModel):
    workouts: List[Workout]

def generate_training_plan_with_ai(request: TrainingPlanRequest) -> TrainingPlanResponse:
    try:
        llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.7,
            api_key=openai_api_key
        )
        
        prompt = ChatPromptTemplate.from_template("""
        Você é um personal trainer especializado em criar planos de treino personalizados.
        Crie um plano de treino para uma pessoa com as seguintes características:
        
        - Idade: {age} anos
        - Altura: {height} cm
        - Tipo de corpo: {body_type}
        - Objetivo: {goal}
        - Dias disponíveis para treino por semana: {training_days}
        - Tempo disponível para cada treino: {training_time} minutos
        - Nível de experiência: {experience_level}
        - Condição atual: {current_condition}
        
        Crie um plano de treino com {training_days} treinos diferentes (A, B, C, etc.).
        Cada treino deve ter exercícios adequados para o nível de experiência e objetivo.
        Para cada exercício, forneça:
        - Nome do exercício
        - Grupo muscular alvo
        - Recorrência (Alta, Média, Baixa)
        - Nível de dificuldade
        - 3 exercícios alternativos
        
        Responda apenas com um JSON no seguinte formato:
        {{
            "workouts": [
                {{
                    "name": "Treino A",
                    "exercises": [
                        {{
                            "name": "Nome do exercício",
                            "target": "grupo muscular",
                            "recurrence": "Alta/Média/Baixa",
                            "level": "Iniciante/Intermediário/Avançado",
                            "alternatives": ["alternativa 1", "alternativa 2", "alternativa 3"]
                        }}
                    ]
                }}
            ]
        }}
        """)
        
        formatted_prompt = prompt.format(
            age=request.age,
            height=request.height,
            body_type=request.body_type,
            goal=request.goal,
            training_days=request.training_days,
            training_time=request.training_time,
            experience_level=request.experience_level,
            current_condition=request.current_condition
        )
        
        response = llm.invoke(formatted_prompt)
        
        response_text = response.content
        
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        if json_start >= 0 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            training_plan = json.loads(json_str)
            return TrainingPlanResponse(**training_plan)
        else:
            raise ValueError("Failed to parse AI response as JSON")
            
    except Exception as e:
        print(f"Error generating training plan: {str(e)}")
        return TrainingPlanResponse(
            workouts=[
                Workout(
                    name="Treino A",
                    exercises=[
                        Exercise(
                            name="Supino reto com barra",
                            target="peitoral",
                            recurrence="Alta",
                            level=request.experience_level,
                            alternatives=[
                                "Supino inclinado com halteres",
                                "Crucifixo na máquina",
                                "Flexão de braço"
                            ]
                        ),
                        Exercise(
                            name="Agachamento livre",
                            target="quadríceps",
                            recurrence="Alta",
                            level=request.experience_level,
                            alternatives=[
                                "Leg press",
                                "Agachamento sumô",
                                "Cadeira extensora"
                            ]
                        )
                    ]
                )
            ]
        )

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API de Treino IA"}

@app.post("/api/generate-training-plan", response_model=TrainingPlanResponse)
async def create_training_plan(request: TrainingPlanRequest):
    try:
        training_plan = generate_training_plan_with_ai(request)
        return training_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    
    uvicorn.run("main:app", host=host, port=port, reload=True)
