from fastapi import APIRouter, status,HTTPException
from apps.schemas.exercicios_schemas import ExercicioCreate, ExercicioResponse, AtualizarExercicio
from apps.repositories.exercicio_repository import ExercicioRepository
from apps.services.exercicio_service import ExercicioService


exercicios_repository = ExercicioRepository()
exercicio_service = ExercicioService(exercicios_repository)

router = APIRouter(prefix = "/exercicios", tags = ["Exercicios"])


# Criar Exericio 
@router.post("/{id_treino}", status_code = status.HTTP_201_CREATED, response_model = ExercicioResponse)
def criar_treino(exericioCreate: ExercicioCreate):
        criar = exercicio_service.cadastrar(
            exericioCreate.nome,
            exericioCreate.series,
            exericioCreate.repeticoes,
            exericioCreate.id_treino
        )
        return criar

# Listar Exercicio por ID
@router.get("/{id_treino}", status_code = status.HTTP_200_OK, response_model = list [ExercicioResponse])
def listar_por_id(id_treino: int):
        lista_id = exercicio_service.listar_por_id(id_treino)
        return lista_id

# Atualizar exercicio
@router.put("/{id_exercicio}", status_code = status.HTTP_200_OK, response_model = ExercicioResponse)
def attExercicio(id_exercicio: int, novoExercicio: AtualizarExercicio):
        att_exercicio = exercicio_service.atualizar(
                id_exercicio,
                novoExercicio.nome,
                novoExercicio.series,
                novoExercicio.repeticoes
        )
        return att_exercicio


# Delete Exercicio
@router.delete("/{id_exercicio}", status_code = status.HTTP_200_OK, response_model = bool)
def deletar_exercicio(id_exercicio: int):
        delete = exercicio_service.deletar(id_exercicio)
        return delete

