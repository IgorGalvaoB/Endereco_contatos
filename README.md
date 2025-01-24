# Cadastro de Contatos

Este é um projeto simples de cadastro de endereços de contatos. O sistema permite que o usuário registre informações de contatos e consulte dados relacionados ao endereço, como CEP, estado e município, através de APIs públicas. Este projeto não possui persistência de dados, ou seja, os dados não são salvos após o fechamento da aplicação.

## Funcionalidades

- Cadastro de informações pessoais e de endereço.
- Consulta de CEP para preenchimento automático dos campos de endereço.
- Exibição de estados e municípios com base no CEP informado.
- Uso de duas APIs públicas para consulta:
  1. **ViaCEP** - Para consulta de dados do CEP: `https://viacep.com.br/ws/${cep}/json/`
  2. **IBGE** - Para consulta de estados e municípios: `https://servicodados.ibge.gov.br/api/v1/localidades/estados`

## Como Usar

### Passo 1: Cadastro de Contato
Preencha os seguintes campos:

- **Nome**: Digite o nome do contato.
- **CPF**: Informe o CPF do contato.
- **Data de Nascimento**: Escolha a data de nascimento.
- **CEP**: Informe o CEP para buscar o endereço. Caso o CEP seja encontrado, os campos de endereço serão automaticamente preenchidos.
- **Logradouro**: Rua ou avenida.
- **Bairro**: Bairro do endereço.
- **Número**: Número da residência.
- **Estado**: Se o CEP não for encontrado, será necessário escolher o estado manualmente.
- **Cidade**: Escolha a cidade correspondente ao estado selecionado.

### Passo 2: Consultar Endereço pelo CEP
Ao digitar um CEP válido, a API do ViaCEP será consultada automaticamente para preencher os campos de **Logradouro**, **Bairro**, **Estado** e **Cidade**.

### Passo 3: Exibir, Buscar ou Excluir Contatos
Você pode exibir os contatos cadastrados, buscar um contato específico ou excluir um contato já cadastrado, mas sem persistência após o fechamento da aplicação.

## Tecnologias Utilizadas

- **HTML** para estruturação do conteúdo da página.
- **CSS** para estilização da interface.
- **JavaScript** para lógica de funcionamento e requisições de APIs.

## Instruções de Execução

1. Clone este repositório para sua máquina local.
   ```bash
   git clone https://github.com/IgorGalvaoB/Endereco_contatos.git
