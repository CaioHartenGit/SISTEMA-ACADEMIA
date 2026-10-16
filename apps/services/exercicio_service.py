from apps.entities.exercicio import Exercicio, ExercicioCreate
from apps.repositories.exercicio_repository import ExercicioRepository
from apps.repositories.treino_repository import TreinoRepository

class ExercicioService:

    def __init__(self, repository,treino_repository):
        self.repository = repository
        self.treino_repository = treino_repository

    def cadastrar(self, nome, series, repeticoes, id_treino):
        exercicio = ExercicioCreate(nome,series,repeticoes,id_treino )

        treino = self.treino_repository.buscar_por_id(exercicio.id_treino)
        if not treino:
            raise ValueError("ID do treino não existe")

        return self.repository.inserir_cadastrar(
            exercicio.nome,
            exercicio.series,
            exercicio.repeticoes,
            exercicio.id_treino
        )



    def listar_por_id(self, id_treino):
        exer = self.repository.listar_por_id(id_treino)
        return exer

    def atualizar(self, id_exercicio, nome, series, repeticoes):
        exercicio = self.repository.atualizar(
            id_exercicio,
            nome,
            series,
            repeticoes
        )

        return exercicio

    def deletar(self, id_exercicio):
        exercicio = self.repository.deletar(id_exercicio)
        
        return exercicio