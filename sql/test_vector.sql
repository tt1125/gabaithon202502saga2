CREATE EXTENSION vector;

CREATE TABLE test_vector (
    id VARCHAR PRIMARY KEY NOT NULL,
    content VARCHAR NOT NULL,
    embedding vector (10) NOT NULL
)

INSERT INTO test_vector (id, content, embedding) VALUES ('1', 'hello', '[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]')

INSERT INTO test_vector (id, content, embedding) VALUES ('2', 'world', '[1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]')

DROP TABLE test_vector;