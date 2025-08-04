# Configuração do Banco de Dados PostgreSQL

## Container Docker

O projeto utiliza um container Docker do PostgreSQL para desenvolvimento local.

### Configurações do Container

- **Nome do Container**: `postgres-bewear`
- **Imagem**: `postgres:15`
- **Porta**: `5432`
- **Usuário**: `postgres`
- **Senha**: `postgres`
- **Banco de Dados**: `bewear`

### Comandos Úteis

#### Iniciar o container

```bash
docker start postgres-bewear
```

#### Parar o container

```bash
docker stop postgres-bewear
```

#### Ver logs do container

```bash
docker logs postgres-bewear
```

#### Conectar ao banco via psql

```bash
docker exec -it postgres-bewear psql -U postgres -d bewear
```

#### Usar Docker Compose

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

### String de Conexão

```
postgresql://postgres:postgres@localhost:5432/bewear
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bewear"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=bewear
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```
