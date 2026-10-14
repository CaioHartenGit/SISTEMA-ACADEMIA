from fastapi import APIRouter, status,HTTPException
from apps.schemas.treino_schemas import TreinoCreate, TreinoAtualizar, TreinoResponse
from apps.repositories.treino_repository import TreinoRepository
from apps.services.treino_service import TreinoService
from typing import Literal


treino_repository = TreinoRepository()
treino_service = TreinoService(treino_repository)

router = APIRouter(prefix = "/treinos", tags = ["Treinos"])

# Criar Treino
@router.post("/",status_code= status.HTTP_201_CREATED)
def criar_treino(TreinoCreate: TreinoCreate):
    treinocreate = treino_service.cadastrar(
        TreinoCreate.nome,
        TreinoCreate.dia_semana,
        TreinoCreate.id_aluno
    )
    return treinocreate

# Listar Treino
@router.get("/", status_code = 200, response_model = list [TreinoResponse])
def lista_treino():
    listar_treino = treino_service.listar()
    if listar_treino == []:
        raise HTTPException(
             status_code = status.HTTP_200_OK,
             detail = "Nenhum treino cadastrado no sistema"        
        )
    return listar_treino

# Listar Treino po ID
@router.get("/{id_aluno}", status_code = 200, response_model = list [TreinoResponse])
def listar_por_id(id_aluno: int):
    lista_por_id = treino_service.buscar_por_id(id_aluno)
    return lista_por_id

# Atualizar Treino
@router.put("/{id_aluno}", status_code = 200, response_model = TreinoResponse)
def atualizar_treino(id_aluno: int, TreinoNovo: TreinoAtualizar):
        atualizar_treino = treino_service.alterar(
             id_aluno,
             TreinoNovo.nome,
             TreinoNovo.novo_dia_semana
        )
        return atualizar_treino

# Deletar treino
@router.delete("/{id_treino}", status_code = 201, response_model = bool)
def deletar(id_treino: int):
     return treino_service.deletar(id_treino)
    