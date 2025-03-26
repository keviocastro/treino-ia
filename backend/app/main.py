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
    level: str
    alternatives: List[str]
    series: Optional[int] = 3
    repetitions: Optional[str] = "12-15"
    rest_time: Optional[int] = 60  # em segundos

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
        Cada treino deve focar em grupos musculares relacionados (ex: peito/tríceps, costas/bíceps, pernas/ombros).
        Para cada exercício, forneça:
        - Nome do exercício
        - Grupo muscular alvo
        - Nível de dificuldade
        - 3 exercícios alternativos
        - Número de séries (normalmente entre 3-5)
        - Número de repetições (ex: "8-12", "12-15", "15-20")
        - Tempo de descanso entre séries (em segundos, normalmente entre 30-90)
        
        Responda apenas com um JSON no seguinte formato:
        {{
            "workouts": [
                {{
                    "name": "Treino A",
                    "exercises": [
                        {{
                            "name": "Nome do exercício",
                            "target": "grupo muscular",
                            "level": "Iniciante/Intermediário/Avançado",
                            "alternatives": ["alternativa 1", "alternativa 2", "alternativa 3"],
                            "series": 3,
                            "repetitions": "12-15",
                            "rest_time": 60
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
        
        workout_names = ["A", "B", "C", "D", "E", "F", "G"]
        fallback_workouts = []
        
        for i in range(min(request.training_days, len(workout_names))):
            if i == 0:  # Treino A - Foco em peito e pernas
                fallback_workouts.append(
                    Workout(
                        name=f"Treino {workout_names[i]}",
                        exercises=[
                            Exercise(
                                name="Supino reto com barra",
                                target="peitoral",
                                level=request.experience_level,
                                alternatives=[
                                    "Supino inclinado com halteres",
                                    "Crucifixo na máquina",
                                    "Flexão de braço"
                                ],
                                series=4,
                                repetitions="8-12",
                                rest_time=60
                            ),
                            Exercise(
                                name="Crucifixo com halteres",
                                target="peitoral",
                                level=request.experience_level,
                                alternatives=[
                                    "Crucifixo na máquina",
                                    "Crossover",
                                    "Flexão de braço"
                                ],
                                series=3,
                                repetitions="10-12",
                                rest_time=45
                            ),
                            Exercise(
                                name="Tríceps corda",
                                target="tríceps",
                                level=request.experience_level,
                                alternatives=[
                                    "Tríceps francês",
                                    "Tríceps testa",
                                    "Mergulho no banco"
                                ],
                                series=3,
                                repetitions="12-15",
                                rest_time=45
                            )
                        ]
                    )
                )
            elif i == 1:  # Treino B - Foco em costas e ombros
                fallback_workouts.append(
                    Workout(
                        name=f"Treino {workout_names[i]}",
                        exercises=[
                            Exercise(
                                name="Puxada frontal",
                                target="costas",
                                level=request.experience_level,
                                alternatives=[
                                    "Remada curvada",
                                    "Puxada alta",
                                    "Remada unilateral"
                                ],
                                series=3,
                                repetitions="10-15",
                                rest_time=60
                            ),
                            Exercise(
                                name="Remada baixa",
                                target="costas",
                                level=request.experience_level,
                                alternatives=[
                                    "Remada curvada",
                                    "Remada cavalinho",
                                    "Pull down"
                                ],
                                series=3,
                                repetitions="10-12",
                                rest_time=45
                            ),
                            Exercise(
                                name="Rosca direta",
                                target="bíceps",
                                level=request.experience_level,
                                alternatives=[
                                    "Rosca alternada",
                                    "Rosca martelo",
                                    "Rosca scott"
                                ],
                                series=3,
                                repetitions="10-12",
                                rest_time=45
                            )
                        ]
                    )
                )
            else:  # Treino C, D, etc. - Foco em braços e abdômen
                fallback_workouts.append(
                    Workout(
                        name=f"Treino {workout_names[i]}",
                        exercises=[
                            Exercise(
                                name="Agachamento livre",
                                target="quadríceps",
                                level=request.experience_level,
                                alternatives=[
                                    "Leg press",
                                    "Agachamento sumô",
                                    "Cadeira extensora"
                                ],
                                series=4,
                                repetitions="10-12",
                                rest_time=60
                            ),
                            Exercise(
                                name="Stiff",
                                target="posterior de coxa",
                                level=request.experience_level,
                                alternatives=[
                                    "Mesa flexora",
                                    "Leg curl",
                                    "Cadeira flexora"
                                ],
                                series=3,
                                repetitions="10-12",
                                rest_time=45
                            ),
                            Exercise(
                                name="Desenvolvimento com halteres",
                                target="ombros",
                                level=request.experience_level,
                                alternatives=[
                                    "Elevação lateral",
                                    "Desenvolvimento máquina",
                                    "Crucifixo inverso"
                                ],
                                series=3,
                                repetitions="10-12",
                                rest_time=45
                            )
                        ]
                    )
                )
        
        return TrainingPlanResponse(workouts=fallback_workouts)

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
