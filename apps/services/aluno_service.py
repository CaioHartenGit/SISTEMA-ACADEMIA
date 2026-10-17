from apps.entities.aluno import Aluno, AlunoCreate, AlunoAtualizar
from apps.repositories.aluno_repository import AlunoRepository
from apps.repositories.treino_repository import TreinoRepository


class AlunoService:

    def __init__(self, repository,treinoRepository):
        self.repository = repository
        self.treino_repository = treinoRepository

    @staticmethod
    def _converter_aluno( dados):
        return Aluno(
            dados["id"],
            dados["nome"],
            dados["idade"],
            dados["plano"],
            dados["ativo"]
    
    )
    @staticmethod
    def _converter_alunoCreate(dados):
        return AlunoCreate(
            dados["nome"],
            dados["idade"],
            dados["plano"]
        )

    @staticmethod
    def _converter_alunoAtualizar(dados):
        return AlunoAtualizar(
            dados["idade"],
            dados["plano"]
        )

    def cadastrar(self, nome, idade, plano):
        aluno = AlunoCreate( nome, idade, plano)

        dados = self.repository.inserir(
            aluno.nome,
            aluno.idade,
            aluno.plano
        )

        return self._converter_alunoCreate(dados)

    def listar(self):
        alunos = self.repository.listar()
        return [self._converter_aluno(dados) for dados in alunos]

    def buscar_por_id(self, id_aluno):
        dados = self.repository.buscar_por_id(id_aluno)
        if dados == None:
            return None
        return self._converter_aluno(dados)

    def buscar_por_nome(self, nome):
        return [
            self._converter_aluno(dados)
            for dados in self.repository.buscar_por_nome(nome)
        ]

    def buscar_por_plano(self, plano):
        return [
            self._converter_aluno(dados)
            for dados in self.repository.buscar_por_plano(plano)
        ]

    def atualizar(self,idade, plano, id_aluno):
        dados = self.repository.atualizar(
            idade,
            plano,
            id_aluno
        )

        return self._converter_aluno(dados)
    
    def deletar(self, id_aluno):
        verifica = self.treino_repository.buscar_por_id(id_aluno)
        if verifica:
            raise ValueError(

                "Não é possivel excluir o aluno!"
                "Ele possui um treino cadastrado"
                
                )
        
        dados = self.repository.deletar(id_aluno)
        if dados is None:
            raise ValueError ("ID do aluno não existe")

        return self._converter_aluno(dados)
      
        
      

    def ativar(self, id_aluno):
        Verificacao = self.buscar_por_id(id_aluno)
        if Verificacao is None:
            raise ValueError("Aluno não encontrado")
        if Verificacao.ativo is True:
            raise ValueError("Aluno já está ativo")
        
        dados = self.repository.ativar(id_aluno)
        return self._converter_aluno(dados)
    

    def desativar(self, id_aluno):
        VERIFICAÇÃO = self.buscar_por_id(id_aluno)
        if VERIFICAÇÃO is None:
            raise ValueError("Aluno não encontrado")
        if VERIFICAÇÃO.ativo is False:
            raise ValueError("Aluno já está desativado")
        
        dados = self.repository.desativar(id_aluno)
        return self._converter_aluno(dados)
    