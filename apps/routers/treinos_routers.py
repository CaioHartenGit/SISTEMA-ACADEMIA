from fastapi import APIRouter, status,HTTPException
from apps.schemas.treino_schemas import TreinoCreate, TreinoAtualizar, TreinoResponse
from apps.repositories.treino_repository import TreinoRepository
from apps.services.treino_service import TreinoService


treino_repository = TreinoRepository()
treino_service = TreinoService(treino_repository)

router = APIRouter(prefix = "/treinos", tags = ["Treinos"])

# Criar Treino
@router.post("/",status_code= status.HTTP_201_CREATED)
def criar_treino(TreinoCreate: TreinoCreate):
    try:
        treinocreate = treino_service.cadastrar(
            TreinoCreate.nome,
            TreinoCreate.dia_semana,
            TreinoCreate.id_aluno
        )
        return treinocreate
    except ValueError as erro:
         raise HTTPException(
              status_code = status.HTTP_400_BAD_REQUEST,
              detail = str(erro)
         )

# Listar Treino
@router.get("/", status_code = 200, response_model = list [TreinoResponse])
def lista_treino():
    listar_treino = treino_service.listar()
    if listar_treino == []:
        return []
    return listar_treino

# Listar Treino po ID
@router.get("/{id_aluno}", status_code = 200, response_model = list [TreinoResponse])
def listar_por_id(id_aluno: int):
    try:
        lista_por_id = treino_service.buscar_por_id(id_aluno)
        return lista_por_id
    except ValueError as erro:
         raise HTTPException(
              status_code = status.HTTP_400_BAD_REQUEST,
              detail = str(erro)
         )

# Atualizar Treino
@router.put("/{id_aluno}", status_code = 200, response_model = TreinoResponse)
def atualizar_treino(id_aluno: int, TreinoNovo: TreinoAtualizar):
        try:
            atualizar_treino = treino_service.alterar(
                id_aluno,
                TreinoNovo.nome,
                TreinoNovo.novo_dia_semana
            )
            if atualizar_treino is None:
                 raise HTTPException(
                      status_code = status.HTTP_404_NOT_FOUND,
                      detail = "Treino Não encontrado"
                 )
            return atualizar_treino
        except ValueError as erro:
             raise HTTPException(
                  status_code= status.HTTP_400_BAD_REQUEST,
                  detail = str(erro)
             )

# Deletar treino
@router.delete("/{id_treino}", status_code = 200, response_model = bool)
def deletar(id_treino: int):
    try:
        delete = treino_service.deletar(id_treino)
        if delete is False:
            raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = "ID treino não encontrado!"
            )
        return delete
    
    except HTTPException:
        raise
    
    except Exception:
         raise HTTPException(
              status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
              detail = "ERRO interno ao deletar o treino"
              )

    