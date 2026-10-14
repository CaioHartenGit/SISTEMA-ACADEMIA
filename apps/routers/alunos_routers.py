from fastapi import APIRouter, status,HTTPException
from apps.schemas.alunos_schemas import AlunoCreate, AlunoResponse, AlunoAtualizar
from apps.repositories.aluno_repository import AlunoRepository
from apps.services.aluno_service import AlunoService
from typing import Literal


aluno_repository = AlunoRepository()
aluno_service = AlunoService(aluno_repository)

router = APIRouter(prefix = "/alunos", tags = ["Alunos"])

# Criar aluno 
@router.post("/",status_code = status.HTTP_201_CREATED, response_model = AlunoCreate)
def cadastrar_alunos(alunoCreate: AlunoCreate):
    cadastro_aluno = aluno_service.cadastrar(
        alunoCreate.nome,
        alunoCreate.idade,
        alunoCreate.plano
        )
 
    
    return cadastro_aluno

# Listar Alunos no Banco - PostgtesSQL
@router.get("/", response_model = list [AlunoResponse])
def listar_alunos():
    listar_aluno = aluno_service.listar()
    if listar_aluno == []:
        raise HTTPException( status_code = status.HTTP_200_OK, detail = "Não tem Alunos cadastrados no sistema")
    return listar_aluno
    

# Buscar por ID
@router.get("/{id_aluno}", response_model = AlunoResponse, status_code = 200)
def buscar_por_id(id_aluno: int):
    aluno_por_id = aluno_service.buscar_por_id(id_aluno)
    if aluno_por_id is None:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "ID não encontrado"
        )
    return aluno_por_id

# Buscar por Nome
@router.get("/nome/{nome}", response_model = list [AlunoResponse],status_code = 200)
def buscar_por_nome(nome: str):
    aluno_por_nome = aluno_service.buscar_por_nome(nome)
    if aluno_por_nome == []:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "Aluno não encontrado")
    return aluno_por_nome

# Buscar por Plano
@router.get("/plano/{plano}", response_model = list [AlunoResponse],status_code = 200)
def buscar_por_plano(plano: Literal["básico", "intermediário", "pro"]):
    aluno_por_plano = aluno_service.buscar_por_plano(plano)
    if aluno_por_plano == []:
        raise HTTPException(status_code = status.HTTP_200_OK, detail = "Plano não encontrado")
    return aluno_por_plano

# Atualizar Aluno
@router.put("/{id_aluno}", response_model = AlunoResponse, status_code = 200)
def atualizar_aluno(id_aluno: int, NovoAluno: AlunoAtualizar):
    atualiza_aluno = aluno_service.atualizar(NovoAluno.idade, NovoAluno.plano, id_aluno)
    if atualiza_aluno is None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "Aluno não foi atualizado")
    return atualiza_aluno

# Deletar Aluno
@router.delete("/{id_aluno}", response_model = AlunoResponse,status_code = 200)
def deletar_aluno(id_aluno: int):
    deleta_aluno = aluno_service.deletar(id_aluno)
    if deleta_aluno is None:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Aluno não encontrado"
        )
    return deleta_aluno
    
#  Ativar Aluno
@router.patch("/{id_aluno}/ativar", response_model = AlunoResponse, status_code = 200 )
def ativar_aluno(id_aluno: int):
    try:
        return aluno_service.ativar(id_aluno)

    except ValueError as erro:
        mensagem = str(erro)
        if mensagem == "Aluno não encontrado":
            raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = mensagem,
            )
        raise HTTPException(
            status_code = status.HTTP_409_CONFLICT,
            detail = mensagem,
        )
    
#  Desativar Aluno
@router.patch("/{id_aluno}/desativar", response_model = AlunoResponse, status_code = 200 )
def desativar_aluno(id_aluno: int):
    try:
        return aluno_service.desativar(id_aluno)
    except ValueError as erro:
        mensagem = str(erro)
        if mensagem == "Aluno não encontrado":
            raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = mensagem,
            )
        raise HTTPException(
            status_code = status.HTTP_409_CONFLICT,
            detail = mensagem
        )
