from pydantic import BaseModel, Field, ConfigDict
from typing import Literal
# ==================================================================================
# Criando Aluno Create
# ==================================================================================
class AlunoCreate(BaseModel):
    nome: str = Field( min_length = 1, max_length = 100)
    idade: int = Field( gt = 0)
    plano: Literal["básico", "intermediário", "pro"]

# ==================================================================================
# Criando Aluno Response
# ==================================================================================
class AlunoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_aluno: int
    nome: str
    idade: int
    plano: str
    ativo: bool



