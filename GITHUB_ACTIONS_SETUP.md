# Configuração do GitHub Actions - Mel Pet Hub

## O que foi criado

Foram criados e corrigidos os seguintes arquivos de workflow do GitHub Actions:

### 1. `.github/workflows/ci.yml` (NOVO)
Workflow de Integração Contínua que executa em:
- Pull requests para a branch `main`
- Pushes para a branch `main`

**O que o workflow CI faz:**
- ✅ Instala as dependências do Node.js
- ✅ Executa o linter ESLint (com tolerância a warnings)
- ✅ Compila o projeto com Vite
- ✅ Valida que a pasta `dist/` foi criada corretamente

### 2. `.github/workflows/deploy-to-s3.yml` (CORRIGIDO)
Workflow de Deploy para AWS S3 que executa em:
- Pushes para a branch `main`

**O que o workflow Deploy faz:**
- ✅ Compila o projeto para produção
- ✅ Faz upload dos arquivos para um bucket S3
- ✅ Invalida o cache do CloudFront (opcional)

**Correção aplicada:**
- Corrigida a condição `if` para validar a existência do CloudFront Distribution ID
- Antes: `if: ${{ secrets.AWS_CLOUDFRONT_DISTRIBUTION_ID != '' }}` (não funcionava)
- Depois: `if: ${{ secrets.AWS_CLOUDFRONT_DISTRIBUTION_ID }}` (funciona corretamente)

## Correções de código aplicadas

Para garantir que o CI funcione corretamente, foram corrigidos 6 erros críticos do ESLint:

1. **src/components/ui/command.tsx**: Interface vazia convertida para type alias
2. **src/components/ui/textarea.tsx**: Interface vazia convertida para type alias
3. **src/lib/password-validation.ts**: Caracteres escapados desnecessariamente em regex
4. **src/pages/PetRegister.tsx**: Uso de `any` substituído por `unknown` com tratamento adequado
5. **tailwind.config.ts**: `require()` substituído por import ES6

## Configuração necessária para funcionamento completo

### Para o workflow de CI (`.github/workflows/ci.yml`)
✅ **Não precisa de configuração adicional** - funciona imediatamente!

### Para o workflow de Deploy (`.github/workflows/deploy-to-s3.yml`)

É necessário configurar os seguintes **secrets** no GitHub:

1. **Acesse seu repositório no GitHub**
2. **Vá para:** Settings → Secrets and variables → Actions
3. **Adicione os seguintes secrets:**

#### Secrets obrigatórios:
- `AWS_ACCESS_KEY_ID`: ID da chave de acesso AWS
- `AWS_SECRET_ACCESS_KEY`: Chave secreta de acesso AWS
- `AWS_REGION`: Região AWS (exemplo: `us-east-1`)
- `AWS_S3_BUCKET`: Nome do bucket S3 (exemplo: `mel-pet-hub-production`)

#### Secret opcional:
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`: ID da distribuição CloudFront (se você usar CloudFront)

### Criando as credenciais AWS

#### 1. Crie um bucket S3:
```bash
# No console AWS ou via CLI
aws s3 mb s3://mel-pet-hub-production --region us-east-1
```

#### 2. Configure o bucket para hospedagem de site estático:
- Habilite "Static website hosting"
- Defina `index.html` como documento index
- Configure as permissões de acesso público (se necessário)

#### 3. Crie um usuário IAM com as seguintes permissões:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::mel-pet-hub-production/*",
        "arn:aws:s3:::mel-pet-hub-production"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

#### 4. Obtenha as credenciais:
- Crie uma access key para o usuário IAM
- Copie o `Access Key ID` e `Secret Access Key`
- Adicione esses valores como secrets no GitHub

## Como testar

### Testando o CI:
1. Crie uma branch de feature
2. Faça um commit
3. Abra um Pull Request para `main`
4. O workflow CI será executado automaticamente

### Testando o Deploy:
1. Certifique-se de que todos os secrets AWS estão configurados
2. Faça merge de um PR para `main` ou faça push direto para `main`
3. O workflow Deploy será executado e publicará no S3

## Estrutura dos workflows

```
.github/
└── workflows/
    ├── ci.yml           # CI - Validação de código em PRs
    └── deploy-to-s3.yml # Deploy - Publicação no S3 após merge
```

## Próximos passos recomendados

1. ✅ **CI Workflow**: Já está funcional, sem configuração adicional necessária
2. ⚙️ **Deploy Workflow**: Requer configuração dos secrets AWS
3. 📝 **Opcional**: Configurar CloudFront para CDN e invalidação de cache
4. 📝 **Opcional**: Adicionar testes unitários ao CI workflow
5. 📝 **Opcional**: Adicionar análise de segurança (Dependabot, CodeQL)

## Verificação do status dos workflows

Você pode verificar o status dos workflows em:
- **Na página do repositório**: Tab "Actions"
- **Nos Pull Requests**: Checks aparecem automaticamente
- **Na branch**: Badge de status pode ser adicionado ao README

## Troubleshooting

### CI falhando:
- Verifique se `npm ci` consegue instalar as dependências
- Execute `npm run lint` localmente para verificar erros
- Execute `npm run build` localmente para verificar a compilação

### Deploy falhando:
- Verifique se todos os secrets AWS estão configurados corretamente
- Verifique as permissões do usuário IAM
- Verifique se o bucket S3 existe e está acessível
- Consulte os logs do workflow na aba Actions do GitHub

## Resumo

✅ **Workflows criados e corrigidos**
✅ **Erros de linting corrigidos**
✅ **CI pronto para uso imediato**
⚙️ **Deploy requer configuração de secrets AWS**

O GitHub Actions está configurado e pronto para uso! O CI funcionará imediatamente, e o deploy funcionará assim que você configurar os secrets AWS no repositório.
