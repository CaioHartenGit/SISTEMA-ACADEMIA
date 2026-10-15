from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Literal


# ==================================================================================
# Criando Exercicio Response
# ==================================================================================
class ExercicioResponse(BaseModel):
    model_config = ConfigDict( from_attributes = True)

    id_exercicio: int 
    nome: str = Field( min_length = 5, max_length = 100 )
    series: int = Field (gt = 1)
    repeticoes: int
    id_treino: int = Field(validation_alias = "id")

# ==================================================================================
# Criando Exercicio Create
# ==================================================================================

class ExercicioCreate(BaseModel):
    nome: str = Field( min_length = 5, max_length = 100 )
    series: int = Field( gt = 1)
    repeticoes: int = Field ( gt = 1)
    id_treino: int = Field(validation_alias = "id")

# ==================================================================================
# Atualizando Exericio
# ==================================================================================
class AtualizarExercicio(BaseModel):
    id_exercicio: int = Field(gt = 1)
    nome: str = Field(min_length = 5, max_length = 100)
    series: int = Field(gt = 1)
    repeticoes: int


# ==================================================================================
# Atualizando Exericio
# ==================================================================================
class DeletarExercicio(BaseModel):
    id_exercicio: int = Field(gt = 0)
