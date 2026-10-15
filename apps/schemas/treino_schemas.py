from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Literal


# ==================================================================================
# Criando Treino Create
# ==================================================================================

class TreinoCreate(BaseModel):
    nome: str = Field(min_length = 5, max_length = 100)
    dia_semana: str = Field(min_length = 5, max_length = 100)
    id_aluno: int


# ==================================================================================
# Criando Treino Response
# ==================================================================================
class TreinoResponse(BaseModel):
    model_config = ConfigDict(from_attributes = True)

    id_treino: int = Field(validation_alias = "id")
    nome: str
    dia_semana: str
    id_aluno: int

# ==================================================================================
# Atualizando Treino
# ==================================================================================

class TreinoAtualizar(BaseModel):
    nome: str = Field(min_length = 5, max_length = 100)
    novo_dia_semana: str = Field(min_length = 5, max_length = 100)

    @field_validator("novo_dia_semana", mode = "before")
    @classmethod
    def normalizar_dia(cls, valor):
        if isinstance(valor, str):
            valor = valor.strip().lower()
            if valor == "sábado":
                valor = "sabado"

            if valor.endswith("-feira"):
                valor = valor.replace("-feira", "")

        return valor

