from apps.entities.treino import Treino, TreinoCreate, TreinoAtualizar
from apps.repositories.treino_repository import TreinoRepository


class TreinoService:

    def __init__(self, repository):
        self.repository = repository

    def cadastrar(self, nome, dia_semana, id_aluno):
        treino = TreinoCreate(nome, dia_semana, id_aluno)

        user = self.repository.inserir_Cadastrar(
            treino.nome,
            treino.dia_semana,
            treino.id_aluno
        )

        return user

    def listar(self):
        treinos = self.repository.listar()
        return treinos

    def buscar_por_id(self, id_aluno):
        treinos = self.repository.buscar_por_id(id_aluno)
        return treinos

    def alterar(self, id_aluno, dia_semana, novo_dia_semana):
        try:
            treinos = self.repository.alterar_treino(
                id_aluno,
                dia_semana,
                novo_dia_semana
            )
            
        except ValueError:
            if treinos is None:
                return None
            
        return treinos

    def deletar(self, id_treino):
        return self.repository.delete_treino(id_treino)
        