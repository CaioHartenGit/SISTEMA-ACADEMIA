from apps.entities.treino import TreinoCreate
from apps.repositories.treino_repository import TreinoRepository
from apps.repositories.exercicio_repository import ExercicioRepository
from apps.repositories.aluno_repository import AlunoRepository


class TreinoService:

    def __init__(self, repository, exercicio_repository, aluno_repository):
        self.repository = repository
        self.exercicio_repository = exercicio_repository
        self.aluno_repository = aluno_repository

    def cadastrar(self, nome, dia_semana, id_aluno):
        treino = TreinoCreate(nome, dia_semana, id_aluno)

        aluno = self.aluno_repository.buscar_por_id(treino.id_aluno)

        if aluno is None:
            raise ValueError("ID do aluno não existe")

        return self.repository.inserir_Cadastrar(
            treino.nome,
            treino.dia_semana,
            treino.id_aluno,
        )

    def listar(self):
        return self.repository.listar()

    def buscar_por_id(self, id_aluno):
        return self.repository.buscar_por_id(id_aluno)

    def alterar(self, id_treino, nome, novo_dia_semana):
        treino = self.repository.alterar_treino(
            id_treino,
            nome,
            novo_dia_semana,
        )

        if treino is None:
            return None

        return treino

    def deletar(self, id_treino):
        exercicios = self.exercicio_repository.listar_por_id(id_treino)

        if exercicios:
            raise ValueError(
                "Não é possível excluir o treino, "
                "pois existem exercícios cadastrados nele."
            )

        return self.repository.delete_treino(id_treino)