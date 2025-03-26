# Treino IA - API

API para gerar treinos utilizando inteligência artificial.

## Tecnologias

- FastAPI
- OpenAI
- LangChain
- Poetry

## Configuração

1. Clone o repositório
2. Configure o arquivo `.env` com sua chave da API OpenAI:
   ```
   OPENAI_API_KEY=sua_chave_aqui
   ```
3. Instale as dependências:
   ```
   cd backend
   poetry install
   ```

## Executando a API

```
cd backend
poetry run python app/main.py
```

A API estará disponível em `http://localhost:8000`.

## Endpoints

### GET /

Retorna uma mensagem de boas-vindas.

### POST /api/generate-training-plan

Gera um plano de treino personalizado com base nos parâmetros fornecidos.

**Parâmetros:**

```json
{
  "client_id": 1234,
  "age": 25,
  "height": 170,
  "body_type": "Masculino",
  "goal": "Hipertrofia",
  "training_days": 3,
  "training_time": 50,
  "experience_level": "Iniciante",
  "current_condition": "Nunca treinei"
}
```

**Resposta:**

```json
{
  "workouts": [
    {
      "name": "Treino A",
      "exercises": [
        {
          "name": "Supino reto com barra",
          "target": "peitoral",
          "recurrence": "Alta",
          "level": "Iniciante",
          "alternatives": [
            "Supino inclinado com halteres",
            "Crucifixo na máquina",
            "Flexão de braço"
          ]
        }
      ]
    }
  ]
}
```
