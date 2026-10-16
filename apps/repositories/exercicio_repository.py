from apps.database.conexao import Conectar
from psycopg.rows import dict_row

class ExercicioRepository:
    def inserir_cadastrar(self, nome, series, repeticoes, id_treino):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)
        try:
            cursor.execute('''
                INSERT INTO exercicio
                (nome, series, repeticoes, id_treino)
                VALUES (%s, %s, %s, %s)
                RETURNING id, nome, series, repeticoes, id_treino;
            ''', (
                nome,
                series,
                repeticoes,
                id_treino
            ))
            exercicio = cursor.fetchone()
            conn.commit()
            return exercicio
        
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()


    def listar_por_id(self, id_treino):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)
        try:
            cursor.execute('''
                SELECT * FROM exercicio
                WHERE id_treino = %s
            ''', (id_treino,))
            exercicio = cursor.fetchall()
            return exercicio
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def atualizar(self, id_exercicio, nome, series, repeticoes):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)
        try:
            cursor.execute('''
                UPDATE exercicio
                SET nome = %s,
                    series = %s,
                    repeticoes = %s
                WHERE id = %s
                RETURNING id, nome, series, repeticoes, id_treino
            ''', (
                nome,
                series,
                repeticoes,
                id_exercicio
            ))
            exercicio = cursor.fetchone()
            conn.commit()
            return exercicio
        
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def deletar(self, id_exercicio):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)
        try:
            cursor.execute('''
                DELETE FROM exercicio
                WHERE id = %s
                RETURNING id
            ''', (id_exercicio,))
            exercicio = cursor.fetchone()
            if exercicio is None:
                return False
            conn.commit()
            return True
        
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()