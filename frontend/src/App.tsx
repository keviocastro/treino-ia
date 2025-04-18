import { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Slider } from './components/ui/slider'
import { Dumbbell, Activity, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

function App() {
  const [loading, setLoading] = useState(false)
  const [trainingPlan, setTrainingPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    age: 25,
    height: 170,
    body_type: "Masculino",
    goal: "Hipertrofia",
    training_days: 3,
    training_time: 50,
    experience_level: "Iniciante",
    current_condition: "Nunca treinei"
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const generateTrainingPlan = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/generate-training-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: Math.floor(Math.random() * 10000),
          age: formData.age,
          height: formData.height,
          body_type: formData.body_type,
          goal: formData.goal,
          training_days: formData.training_days,
          training_time: formData.training_time,
          experience_level: formData.experience_level,
          current_condition: formData.current_condition
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao gerar o plano de treino')
      }

      const data = await response.json()
      setTrainingPlan(data)
    } catch (error) {
      console.error('Erro:', error)
      
      const getExercisesByLevel = (level: string): number => {
        if (level === "Avançado") return 6;
        if (level === "Intermediário") return 5;
        return 3; // Iniciante
      };
      
      const fallbackWorkouts = [];
      const workoutNames = ["A", "B", "C", "D", "E", "F", "G"];
      const exercisesCount = getExercisesByLevel(formData.experience_level);
      
      for (let i = 0; i < Math.min(formData.training_days, workoutNames.length); i++) {
        if (i === 0) {
          const exercises = [
            {
              name: "Supino reto com barra",
              target: "peitoral",
              level: formData.experience_level,
              alternatives: [
                "Supino inclinado com halteres",
                "Crucifixo na máquina",
                "Flexão de braço"
              ],
              series: 4,
              repetitions: "8-12",
              rest_time: 60
            },
            {
              name: "Crucifixo com halteres",
              target: "peitoral",
              level: formData.experience_level,
              alternatives: [
                "Crucifixo na máquina",
                "Crossover",
                "Flexão de braço"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 45
            },
            {
              name: "Tríceps corda",
              target: "tríceps",
              level: formData.experience_level,
              alternatives: [
                "Tríceps francês",
                "Tríceps testa",
                "Mergulho no banco"
              ],
              series: 3,
              repetitions: "12-15",
              rest_time: 45
            }
          ];
          
          if (exercisesCount > 3) {
            exercises.push({
              name: "Supino inclinado",
              target: "peitoral superior",
              level: formData.experience_level,
              alternatives: [
                "Supino inclinado com halteres",
                "Flexão de braço inclinada",
                "Máquina de supino inclinado"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 60
            });
          }
          
          if (exercisesCount > 4) {
            exercises.push({
              name: "Tríceps francês",
              target: "tríceps",
              level: formData.experience_level,
              alternatives: [
                "Tríceps testa",
                "Tríceps coice",
                "Fundos no banco"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 45
            });
          }
          
          if (exercisesCount > 5) {
            exercises.push({
              name: "Peck deck",
              target: "peitoral",
              level: formData.experience_level,
              alternatives: [
                "Crossover",
                "Crucifixo com cabos",
                "Push-up"
              ],
              series: 3,
              repetitions: "12-15",
              rest_time: 45
            });
          }
          
          fallbackWorkouts.push({
            name: `Treino ${workoutNames[i]}`,
            exercises: exercises
          });
        } else if (i === 1) {
          const exercises = [
            {
              name: "Puxada frontal",
              target: "costas",
              level: formData.experience_level,
              alternatives: [
                "Remada curvada",
                "Puxada alta",
                "Remada unilateral"
              ],
              series: 3,
              repetitions: "10-15",
              rest_time: 60
            },
            {
              name: "Remada baixa",
              target: "costas",
              level: formData.experience_level,
              alternatives: [
                "Remada curvada",
                "Remada cavalinho",
                "Pull down"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 45
            },
            {
              name: "Rosca direta",
              target: "bíceps",
              level: formData.experience_level,
              alternatives: [
                "Rosca alternada",
                "Rosca martelo",
                "Rosca scott"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 45
            }
          ];
          
          if (exercisesCount > 3) {
            exercises.push({
              name: "Puxada aberta",
              target: "dorsal",
              level: formData.experience_level,
              alternatives: [
                "Puxada triângulo",
                "Puxada pulley",
                "Barra fixa"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 60
            });
          }
          
          if (exercisesCount > 4) {
            exercises.push({
              name: "Rosca martelo",
              target: "bíceps e braquial",
              level: formData.experience_level,
              alternatives: [
                "Rosca 21",
                "Rosca scott",
                "Rosca concentrada"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 45
            });
          }
          
          if (exercisesCount > 5) {
            exercises.push({
              name: "Pull-over",
              target: "dorsal e serrátil",
              level: formData.experience_level,
              alternatives: [
                "Pull-over com halter",
                "Pulldown",
                "Remada alta"
              ],
              series: 3,
              repetitions: "12-15",
              rest_time: 45
            });
          }
          
          fallbackWorkouts.push({
            name: `Treino ${workoutNames[i]}`,
            exercises: exercises
          });
        } else {
          const exercises = [
            {
              name: "Agachamento livre",
              target: "quadríceps",
              level: formData.experience_level,
              alternatives: [
                "Leg press",
                "Agachamento sumô",
                "Cadeira extensora"
              ],
              series: 4,
              repetitions: "10-12",
              rest_time: 60
            },
            {
              name: "Stiff",
              target: "posterior de coxa",
              level: formData.experience_level,
              alternatives: [
                "Mesa flexora",
                "Leg curl",
                "Cadeira flexora"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 45
            },
            {
              name: "Desenvolvimento com halteres",
              target: "ombros",
              level: formData.experience_level,
              alternatives: [
                "Elevação lateral",
                "Desenvolvimento máquina",
                "Crucifixo inverso"
              ],
              series: 3,
              repetitions: "10-12",
              rest_time: 45
            }
          ];
          
          if (exercisesCount > 3) {
            exercises.push({
              name: "Elevação lateral",
              target: "deltoide lateral",
              level: formData.experience_level,
              alternatives: [
                "Elevação frontal",
                "Pássaro",
                "Elevação lateral na máquina"
              ],
              series: 3,
              repetitions: "12-15",
              rest_time: 45
            });
          }
          
          if (exercisesCount > 4) {
            exercises.push({
              name: "Panturrilha em pé",
              target: "gastrocnêmio",
              level: formData.experience_level,
              alternatives: [
                "Panturrilha sentado",
                "Elevação de panturrilha no leg press",
                "Saltos"
              ],
              series: 4,
              repetitions: "15-20",
              rest_time: 30
            });
          }
          
          if (exercisesCount > 5) {
            exercises.push({
              name: "Crucifixo inverso",
              target: "deltoide posterior",
              level: formData.experience_level,
              alternatives: [
                "Pássaro",
                "Face pull",
                "Remada alta"
              ],
              series: 3,
              repetitions: "12-15",
              rest_time: 45
            });
          }
          
          fallbackWorkouts.push({
            name: `Treino ${workoutNames[i]}`,
            exercises: exercises
          });
        }
      }
      
      setTrainingPlan({
        workouts: fallbackWorkouts
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">Treino Personalizado</h1>
          <p className="text-slate-600">Crie seu plano de treino personalizado baseado em suas características e objetivos</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Informações do Usuário
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Preencha seus dados para um treino personalizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Idade</label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleInputChange('age', Math.max(formData.age - 1, 18))}
                    >
                      -
                    </Button>
                    <Input 
                      type="number" 
                      value={formData.age} 
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      className="text-center"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleInputChange('age', formData.age + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Altura (cm)</label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleInputChange('height', Math.max(formData.height - 1, 140))}
                    >
                      -
                    </Button>
                    <Input 
                      type="number" 
                      value={formData.height} 
                      onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                      className="text-center"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleInputChange('height', formData.height + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Corpo Desejado</label>
                  <Select 
                    value={formData.body_type}
                    onValueChange={(value) => handleInputChange('body_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de corpo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Objetivo</label>
                  <Select 
                    value={formData.goal}
                    onValueChange={(value) => handleInputChange('goal', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
                      <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                      <SelectItem value="Resistência">Resistência</SelectItem>
                      <SelectItem value="Força">Força</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Dias Disponíveis para Treino por Semana: {formData.training_days}</span>
                    <span className="text-indigo-600 font-semibold">{formData.training_days}</span>
                  </label>
                  <Slider
                    value={[formData.training_days]}
                    min={1}
                    max={7}
                    step={1}
                    onValueChange={(value) => handleInputChange('training_days', value[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>7</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Tempo Disponível para Cada Treino (minutos)</span>
                    <span className="text-indigo-600 font-semibold">{formData.training_time}</span>
                  </label>
                  <Slider
                    value={[formData.training_time]}
                    min={25}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleInputChange('training_time', value[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>25</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nível de Experiência</label>
                  <Select 
                    value={formData.experience_level}
                    onValueChange={(value) => handleInputChange('experience_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Situação Atual</label>
                  <Select 
                    value={formData.current_condition}
                    onValueChange={(value) => handleInputChange('current_condition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua situação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nunca treinei">Nunca treinei</SelectItem>
                      <SelectItem value="Treino há menos de 6 meses">Treino há menos de 6 meses</SelectItem>
                      <SelectItem value="Treino há mais de 6 meses">Treino há mais de 6 meses</SelectItem>
                      <SelectItem value="Treino há mais de 1 ano">Treino há mais de 1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700" 
                  onClick={generateTrainingPlan}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando...
                    </span>
                  ) : 'Obter Ficha de Treino'}
                </Button>
              </CardContent>
            </Card>

            {formData && (
              <Card className="mt-6 shadow-lg">
                <CardHeader className="bg-indigo-100 text-indigo-800 rounded-t-lg">
                  <CardTitle className="text-lg">Informações Selecionadas</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto">
                    {JSON.stringify({
                      client_id: Math.floor(Math.random() * 10000),
                      age: formData.age,
                      height: formData.height,
                      body_type: formData.body_type,
                      goal: formData.goal,
                      training_days: formData.training_days,
                      training_time: formData.training_time,
                      experience_level: formData.experience_level,
                      current_condition: formData.current_condition
                    }, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            {trainingPlan ? (
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader className="bg-green-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Seu Plano de Treino Personalizado
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Baseado nas suas características e objetivos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {trainingPlan.workouts && trainingPlan.workouts.map((workout: any, workoutIndex: number) => (
                      <div key={workoutIndex} className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{workout.name}</h3>
                        <div className="space-y-6">
                          {workout.exercises && workout.exercises.map((exercise: any, exerciseIndex: number) => (
                            <Card key={exerciseIndex} className="border border-gray-200">
                              <CardHeader className="bg-gray-50 pb-2">
                                <CardTitle className="text-lg text-indigo-700">{exercise.name}</CardTitle>
                                <div className="flex flex-wrap gap-2 text-sm">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    Alvo: {exercise.target}
                                  </span>
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Nível: {exercise.level}
                                  </span>
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                    Séries: {exercise.series || 3}
                                  </span>
                                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                                    Repetições: {exercise.repetitions || "12-15"}
                                  </span>
                                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                    Descanso: {exercise.rest_time || 60} seg
                                  </span>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {exercise.alternatives && exercise.alternatives.map((alternative: string, altIndex: number) => (
                                    <div key={altIndex} className="flex items-start gap-2">
                                      <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {altIndex + 1}
                                      </div>
                                      <div>
                                        <p className="font-medium">{`Alternativa ${altIndex + 1}`}</p>
                                        <p className="text-gray-600">{alternative}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Dicas para seu Treino
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-bold text-blue-800 mb-2">Hidratação</h4>
                        <p className="text-gray-700">Mantenha-se hidratado durante todo o treino. Recomenda-se beber água antes, durante e após os exercícios.</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-bold text-green-800 mb-2">Descanso</h4>
                        <p className="text-gray-700">Respeite o tempo de descanso entre as séries e entre os dias de treino para uma melhor recuperação muscular.</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h4 className="font-bold text-amber-800 mb-2">Alimentação</h4>
                        <p className="text-gray-700">Mantenha uma alimentação balanceada rica em proteínas para auxiliar no seu objetivo de {formData.goal.toLowerCase()}.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Card className="w-full shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center p-12">
                    <Dumbbell className="h-16 w-16 text-indigo-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Seu plano de treino personalizado</h3>
                    <p className="text-gray-600 text-center mb-6">
                      Preencha suas informações e clique em "Obter Ficha de Treino" para gerar seu plano personalizado.
                    </p>
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Activity className="h-5 w-5" />
                      <span>Treinos adaptados ao seu perfil e objetivos</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
