from fastapi import APIRouter, status, HTTPException

from apps.schemas.treino_schemas import (
    TreinoCreate,
    TreinoAtualizar,
    TreinoResponse,
)
from apps.repositories.treino_repository import TreinoRepository
from apps.services.treino_service import TreinoService
from apps.repositories.exercicio_repository import ExercicioRepository
from apps.repositories.aluno_repository import AlunoRepository


treino_repository = TreinoRepository()
exercicio_repository = ExercicioRepository()
aluno_repository = AlunoRepository()

treino_service = TreinoService(
    treino_repository,
    exercicio_repository,
    aluno_repository,
)

router = APIRouter(
    prefix="/treinos",
    tags=["Treinos"],
)


# Criar treino
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TreinoResponse)
def criar_treino(treino_create: TreinoCreate):
    try:
        treino_criado = treino_service.cadastrar(
            treino_create.nome,
            treino_create.dia_semana,
            treino_create.id_aluno,
        )

        return treino_criado

    except ValueError as erro:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(erro),
        ) from erro


# Listar todos os treinos
@router.get("/", status_code=status.HTTP_200_OK, response_model=list[TreinoResponse])
def lista_treino():
    return treino_service.listar()


# Listar treinos por ID do aluno
@router.get(
    "/{id_aluno}",
    status_code=status.HTTP_200_OK,
    response_model=list[TreinoResponse],
)
def listar_por_id(id_aluno: int):
    try:
        return treino_service.buscar_por_id(id_aluno)

    except ValueError as erro:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(erro),
        ) from erro


# Atualizar um treino específico pelo ID do treino
@router.put(
    "/{id_treino}",
    status_code=status.HTTP_200_OK,
    response_model=TreinoResponse,
)
def atualizar_treino(id_treino: int, treino_novo: TreinoAtualizar):
    try:
        treino_atualizado = treino_service.alterar(
            id_treino,
            treino_novo.nome,
            treino_novo.novo_dia_semana,
        )

        if treino_atualizado is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Treino não encontrado.",
            )

        return treino_atualizado

    except ValueError as erro:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(erro),
        ) from erro


# Deletar treino pelo ID do treino
@router.delete("/{id_treino}", status_code=status.HTTP_200_OK)
def deletar(id_treino: int):
    try:
        deletado = treino_service.deletar(id_treino)

        if deletado is False:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ID do treino não encontrado!",
            )

        return {"Mensagem": "Treino foi deletado com sucesso."}

    except HTTPException:
        raise

    except ValueError as erro:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(erro),
        ) from erro
