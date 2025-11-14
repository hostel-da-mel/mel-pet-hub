# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4279b2a9-8d08-4cf8-937c-ced705e58783

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4279b2a9-8d08-4cf8-937c-ced705e58783) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Configurando a URL da API

Este projeto utiliza variáveis de ambiente do Vite para definir a URL base das chamadas HTTP. Copie o arquivo `.env.example` para `.env` na raiz do repositório (ou defina a variável de ambiente no sistema) e ajuste a propriedade `VITE_API_URL` apontando para o backend desejado:

```bash
cp .env.example .env
```

Em seguida, edite o arquivo `.env` para refletir o endpoint correto. Caso a variável não seja fornecida, o aplicativo utilizará automaticamente os endpoints padrão para desenvolvimento, homologação e produção com base no `hostname` acessado.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 1: Lovable Deploy

Simply open [Lovable](https://lovable.dev/projects/4279b2a9-8d08-4cf8-937c-ced705e58783) and click on Share -> Publish.

### Option 2: AWS S3 Automatic Deployment

This project includes a GitHub Actions workflow that automatically deploys to AWS S3 when you push to the `main` branch.

#### Setup Instructions:

1. **Create an S3 bucket** in your AWS account for hosting the static website
2. **Configure the S3 bucket** for static website hosting
3. **Create an IAM user** with programmatic access and attach a policy with S3 permissions
4. **Add the following secrets** to your GitHub repository (Settings > Secrets and variables > Actions):
   - `AWS_ACCESS_KEY_ID`: Your AWS access key ID
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
   - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
   - `AWS_S3_BUCKET`: Your S3 bucket name (e.g., `my-app-bucket`)
   - `AWS_CLOUDFRONT_DISTRIBUTION_ID` (optional): CloudFront distribution ID for cache invalidation

#### Required IAM Permissions:

Your IAM user needs the following permissions:

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
        "arn:aws:s3:::your-bucket-name/*",
        "arn:aws:s3:::your-bucket-name"
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

Once configured, every push to the `main` branch will automatically build and deploy your application to S3.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
