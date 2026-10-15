class Treino:
    def __init__(self,id_treino,nome,dia_semana,id_aluno):
        self.id_treino = id_treino
        self.nome = nome 
        self.dia_semana = dia_semana # DIA
        self.id_aluno = id_aluno # ID 


    @property
    def nome(self):
        return self._nome

    @nome.setter
    def nome(self, novoNome):
        if not isinstance(novoNome, str):
            raise ValueError("Nome inválido")
        novoNome = novoNome.strip().lower()
        if novoNome == "":
            raise ValueError("Campo nome não pode ser vazio")
        if len(novoNome) > 50:
            raise ValueError("Quantidade de caracteres excedida")
        self._nome = novoNome

    @property 
    def id_aluno(self):
        return self._id_aluno

    @id_aluno.setter
    def id_aluno(self,NovoID):
        if isinstance(NovoID, bool) or not isinstance(NovoID, int):
            raise ValueError("ID aluno precisa ser um número inteiro válido")
        if NovoID <= 0:
            raise ValueError("O ID aluno não pode ser negativo")
        self._id_aluno = NovoID

    @property
    def dia_semana(self):
        return self._dia_semana
    
    
    @dia_semana.setter
    def dia_semana(self, novoDiaSemana):
        DIAVALIDO = [
            "segunda", "terça", "quarta", "quinta",
            "sexta", "sabado", "domingo"
        ]
        if not isinstance(novoDiaSemana, str):
            raise ValueError("Informe corretamente o dia da semana")
        novoDiaSemana = novoDiaSemana.strip().lower()
        if novoDiaSemana.endswith("-feira"):
            novoDiaSemana = novoDiaSemana.replace("-feira", "")
        if novoDiaSemana == "sábado":
            novoDiaSemana = "sabado"
        if novoDiaSemana == "":
            raise ValueError("Dia da semana não pode ser vazio")
        if len(novoDiaSemana) > 20:
            raise ValueError("Quantidade de caracteres excedida")
        if novoDiaSemana not in DIAVALIDO:
            raise ValueError("Dia da semana inválido!")
        self._dia_semana = novoDiaSemana
        
# ===========================================================================
# Validando Dados
# ==========================================================================

class TreinoCreate(Treino):
    def __init__(self,nome,dia_semana,id_aluno):
        super().__init__(None,nome,dia_semana,id_aluno)


class TreinoAtualizar(Treino):
    def __init__(self,nome,dia_semana,id_aluno,novo_dia_semana):
        super().__init(None,nome,dia_semana,id_aluno)
        self.novo_dia_semana = novo_dia_semana

