from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Literal


# ==================================================================================
# Criando Exercicio Response
# ==================================================================================
class ExercicioResponse(BaseModel):
    model_config = ConfigDict( from_attributes = True)

    id_exercicio: int = Field(validation_alias = "id")
    nome: str 
    series: int
    repeticoes: int
    id_treino: int 

# ==================================================================================
# Criando Exercicio Create
# ==================================================================================

class ExercicioCreate(BaseModel):
    nome: str = Field( min_length = 5, max_length = 100 )
    series: int = Field( gt = 0)
    repeticoes: int = Field ( gt = 0)
    id_treino: int

# ==================================================================================
# Atualizando Exericio
# ==================================================================================
class AtualizarExercicio(BaseModel):
    nome: str = Field(min_length = 3, max_length = 100)
    series: int = Field(gt = 0)
    repeticoes: int

'''
# ==================================================================================
# Delete Exericio
# ==================================================================================
class DeletarExercicio(BaseModel):
    id_exercicio: int = Field(validation_alias = "id")
'''