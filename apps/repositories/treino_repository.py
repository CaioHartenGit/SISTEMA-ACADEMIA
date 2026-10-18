from apps.database.conexao import Conectar
from psycopg.rows import dict_row


class TreinoRepository:

    def inserir_Cadastrar(self, nome, dia_semana, id_aluno):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)

        try:
            cursor.execute(
                """
                INSERT INTO treino (nome, dia_semana, id_aluno)
                VALUES (%s, %s, %s)
                RETURNING id, nome, dia_semana, id_aluno
                """,
                (nome, dia_semana, id_aluno),
            )

            treino = cursor.fetchone()
            conn.commit()
            return treino

        except Exception:
            conn.rollback()
            raise

        finally:
            cursor.close()
            conn.close()

    def listar(self):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)

        try:
            cursor.execute(
                """
                SELECT id, nome, dia_semana, id_aluno
                FROM treino
                ORDER BY id
                """
            )

            return cursor.fetchall()

        except Exception:
            conn.rollback()
            raise

        finally:
            cursor.close()
            conn.close()

    def buscar_por_id_treino(self, id_treino):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)

        try:
            cursor.execute(
                """
                SELECT id, nome, dia_semana, id_aluno
                FROM treino
                WHERE id = %s
                """,
                (id_treino,),
            )

            return cursor.fetchone()

        except Exception:
            conn.rollback()
            raise

        finally:
            cursor.close()
            conn.close()

    def buscar_por_id(self, id_aluno):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)

        try:
            cursor.execute(
                """
                SELECT id, nome, dia_semana, id_aluno
                FROM treino
                WHERE id_aluno = %s
                ORDER BY id
                """,
                (id_aluno,),
            )

            return cursor.fetchall()

        except Exception:
            conn.rollback()
            raise

        finally:
            cursor.close()
            conn.close()

    def alterar_treino(self, id_treino, nome, novo_dia_semana):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)

        try:
            cursor.execute(
                """
                UPDATE treino
                SET nome = %s,
                    dia_semana = LOWER(%s)
                WHERE id = %s
                RETURNING id, nome, dia_semana, id_aluno
                """,
                (nome, novo_dia_semana, id_treino),
            )

            treino = cursor.fetchone()
            conn.commit()
            return treino

        except Exception:
            conn.rollback()
            raise

        finally:
            cursor.close()
            conn.close()

    def delete_treino(self, id_treino):
        conn = Conectar.conectar()
        cursor = conn.cursor(row_factory=dict_row)

        try:
            cursor.execute(
                """
                DELETE FROM treino
                WHERE id = %s
                RETURNING id
                """,
                (id_treino,),
            )

            treino = cursor.fetchone()

            if treino is None:
                conn.rollback()
                return False

            conn.commit()
            return True

        except Exception:
            conn.rollback()
            raise

        finally:
            cursor.close()
            conn.close()