# Treino IA

Aplicação para gerar planos de treino personalizados utilizando inteligência artificial.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

- **Backend**: API em Python/FastAPI que utiliza OpenAI/LangChain para gerar planos de treino personalizados
- **Frontend**: Interface de usuário em React/TypeScript para interação com a API

## Requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local do frontend)
- Python 3.10+ (para desenvolvimento local do backend)
- Poetry (para gerenciamento de dependências do backend)

## Iniciando a Aplicação

### Usando Docker Compose (Recomendado)

A maneira mais fácil de iniciar a aplicação é usando Docker Compose, que configurará tanto o backend quanto o frontend automaticamente:

1. Clone o repositório:
   ```bash
   git clone https://github.com/keviocastro/treino-ia.git
   cd treino-ia
   ```

2. Configure a chave da API OpenAI:
   ```bash
   # Crie um arquivo .env na pasta backend
   echo "OPENAI_API_KEY=sua_chave_aqui" > backend/.env
   ```

3. Inicie os containers:
   ```bash
   docker-compose up -d
   ```

4. Acesse a aplicação:
   - Frontend: http://localhost:5173
   - API: http://localhost:8000

### Ambiente de Desenvolvimento

#### Backend (Python/FastAPI)

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências usando Poetry:
   ```bash
   poetry install
   ```

3. Configure a chave da API OpenAI:
   ```bash
   # Crie um arquivo .env na pasta backend
   echo "OPENAI_API_KEY=sua_chave_aqui" > .env
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   poetry run python app/main.py
   ```

5. A API estará disponível em http://localhost:8000

#### Frontend (React/TypeScript)

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a URL da API:
   ```bash
   # Crie um arquivo .env na pasta frontend
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. O frontend estará disponível em http://localhost:5173

## Endpoints da API

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
