
//ELEMENTOS DO DOM COM FUNCOES:
const cepInput = document.querySelector("#cep")
const estadosSelect = document.getElementById("estados")
const cidadesSelect = document.getElementById("cidades")
const cpfInput = document.getElementById("cpf")

//URLs:
const urlEstados = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
const urlCidades = estadoId => {
    return `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`
}
//FUNCOES CPF:
const formatarCPF = cpf => {
    cpf = cpf.replace(/\D/g, '')
    return cpf.replace(/^(\d{3})(\d{0,3})(\d{0,3})(\d{0,2})$/, (match, p1, p2, p3, p4) => {
        if (p4) return `${p1}.${p2}.${p3}-${p4}`
        if (p3) return `${p1}.${p2}.${p3}`
        if (p2) return `${p1}.${p2}`
        return p1
    })    
}
//AUSCULTADORES CPF:
cpfInput.addEventListener('input', e => {
    const cpf = e.target.value
    e.target.value = formatarCPF(cpf)
})

//FUNCOES ESTADOS E CIDADES:
//Estados:
const carregarEstados = async() => {
    try {
        const response = await fetch(urlEstados)
        const estados = await response.json()
        const estadoSiglaArray = []
        const defaultUF = document.createElement("option")
        estadosSelect.innerHTML = ""
        defaultUF.selected = true
        defaultUF.value = ""
        defaultUF.textContent = "UF"
        estados.forEach((estado)=>{
            estadoSiglaArray.push(estado.sigla)
        })
        estadoSiglaArray.sort((prev,next)=> prev>next?1:-1 )
    
        estadosSelect.appendChild(defaultUF)
        estadoSiglaArray.forEach(estado => {
            const option = document.createElement("option")
            option.value = estado
            option.textContent = `${estado}`
            estadosSelect.appendChild(option)
        })
        // Carrega cidades do estado selecionado na mudanca
        estadosSelect.addEventListener("change", () => carregarCidades(estadosSelect.value))
    } catch (error) {
        console.error("Erro ao carregar estados:", error)
    }
}

//carrega estados quando inicializar a pagina:
carregarEstados()

//Cidades:
const carregarCidades = async(estadoId) => {
    try {
        
        cidadesSelect.innerHTML = ""
        const response = await fetch(urlCidades(estadoId))
        const cidades = await response.json()
        
        const defaultOption = document.createElement("option")
        defaultOption.value = ""
        defaultOption.textContent = "Selecione uma cidade"
        defaultOption.disabled = true
        defaultOption.selected = true
        cidadesSelect.appendChild(defaultOption)
        cidades.forEach(cidade => {
            const option = document.createElement("option")
            option.value = cidade.nome
            option.textContent = cidade.nome
            cidadesSelect.appendChild(option)
        })
    } catch (error) {
        console.error("Erro ao carregar cidades:", error)
    }
}


//FUNCOES DE CEP:
const formatarCEP = (valor)=>{
    valor = valor.replace(/\D/g, '')
    return valor.replace(/^(\d{5})(\d{0,3})$/, (match, p1, p2) => {
        return p2 ? `${p1}-${p2}` : p1
    })
}
const formatarCepMenor = (cep)=>{
    let apenasNumeros = cep.replace(/\D/g, '')
    apenasNumeros = apenasNumeros.padStart(8, '0')
    return apenasNumeros.slice(0, 5) + '-' + apenasNumeros.slice(5)
}
const liberarCidade = () => {
    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Selecione uma cidade"
    defaultOption.selected = true
    cidadesSelect.innerHTML = ""
    cidadesSelect.appendChild(defaultOption)
}
liberarCidade()
const liberarCampos = () => {
    carregarEstados()
    liberarCidade()
    document.querySelector("#logradouro").value = ""
    document.querySelector("#bairro").value = ""
    document.querySelector("#logradouro").removeAttribute("readonly")
    document.querySelector("#bairro").removeAttribute("readonly")
    document.querySelector("#logradouro").removeAttribute("disabled")
    document.querySelector("#cidades").removeAttribute("disabled")
    document.querySelector("#estados").removeAttribute("disabled")
    document.querySelector("#bairro").removeAttribute("disabled")
}
const buscarCEP = async (cep)=> { 
    cep = cep.replace(/\D/g, '') 
    const urlCep = `https://viacep.com.br/ws/${cep}/json/`
    if (cep.length !== 8) {
        
        console.error("CEP inválido. Por favor, insira um CEP com 8 dígitos.")
        liberarCampos()
        return
    }  
    try {
        const response = await fetch(urlCep)
        if (!response.ok) {
            throw new Error("Erro ao buscar o CEP. Tente novamente mais tarde.")
        }
        const dados = await response.json()
        if (dados.erro) {
            console.error("CEP não encontrado.")
            liberarCampos()
            return
        }
        document.querySelector("#logradouro").value = dados.logradouro
        document.querySelector("#bairro").value = dados.bairro
        const defaultOptionCidade = document.createElement("option")
        defaultOptionCidade.textContent = `${dados.localidade}`
        defaultOptionCidade.selected = true 
        cidadesSelect.disabled = true
        cidadesSelect.appendChild(defaultOptionCidade)
        const defaultOptionEstado = document.createElement("option")
        defaultOptionEstado.textContent = `${dados.uf}`
        defaultOptionEstado.selected = true
        estadosSelect.disabled = true
        estadosSelect.appendChild(defaultOptionEstado)
        document.querySelector("#logradouro").setAttribute("disabled", true)
        document.querySelector("#logradouro").setAttribute("readonly", true)
        document.querySelector("#bairro").setAttribute("readonly", true)
        document.querySelector("#bairro").setAttribute("disabled", true)

    } catch (erro) {
        console.error("Erro na busca do CEP:", erro)
        liberarCampos()
    }
}
//AUSCULTADORES DE CEP:
cepInput.addEventListener("input", e => {
    const cep = e.target.value    
    e.target.value = formatarCEP(e.target.value)
    if (cep.length === 9) {
        buscarCEP(cep)
    }
})
cepInput.addEventListener("blur", e => {
 
    if (e.target === cepInput){
        const cep = e.target.value
        let cepFormatado = cep
 
        if(cep.length<9){
            cepFormatado = formatarCepMenor(cep)
            e.target.value = cepFormatado
            buscarCEP(cepFormatado)
            return
        }
    }       
})
cepInput.addEventListener("keypress", e => {
    if (document.activeElement == cepInput & e.key === 'Enter'){
        e.preventDefault()
        const cep = e.target.value
        let cepFormatado = cep
        if(cep.length<9){
            cepFormatado = formatarCepMenor(cep)
            e.target.value = cepFormatado
            buscarCEP(cepFormatado)
            return
        }
        buscarCEP(cepFormatado)
    }
})
/*############################################################
########################### BUTOES ###########################
##############################################################*/ 
const contatos = [
    {
        nome:"dfasdfas",
        dataNascimento: "12312",
        cpf:"12312312312",
        endereco:{
            logradouro:"aaa aa aaaa",
            numero:"1231",
            estado:"RN",
            cep:"34243-343",
            cidade:"Natal",
            bairro:"Nova Descoberta",
        }
    } 
]
//ELEMENTOS COM FUNCOES:
const formulario = document.querySelector('#formCadastro')
const botaoExcluirContato = document.getElementById('excluirContato')
const selectExibirContaos = document.getElementById('exibirContatos')
const contatosCards = document.getElementById('contatosCards')
//VALIDAR SE JA EXISTE PELO CPF
const validarDuplicados = cpf => {
    return contatos.every(contato => contato.cpf !== cpf)
}
//ADIONAR CONTATO:
const adicionarContato = () => {
    const nome = document.getElementById('nome').value.replace(/[^a-zA-Z\s]/g, '').replace(/\b\w+\b/g, nome => {
        return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    })
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '')
    const dataNascimento = document.getElementById('dataNascimento').value
   
    const cep = document.getElementById('cep').value
    const logradouro = document.getElementById('logradouro').value
    const numero = document.getElementById('numero').value
    const bairro = document.getElementById('bairro').value
    
    const estados = document.getElementById('estados')
    const estado = estados.options[estados.selectedIndex].text

    const cidades = document.getElementById('cidades')
    const cidade = cidades.options[cidades.selectedIndex].text

    const endereco = {logradouro,cep,numero,bairro,estado,cidade}
    if(nome.length===0){
        alert('Nome inválido')
        return
    }
    if(cidade=="Selecione uma cidade" || estado == 'UF'){
        alert('Cidade e estado devem ser selecionados')
        return
    }
    if(cpf.length !== 11){
        alert("CPF inválido")
        return
    }  
    if (!validarDuplicados(cpf)) {
        alert('Erro: CPF já cadastrado!')
        return
    }

    const novoContato = { nome, cpf, dataNascimento, endereco }
    contatos.push(novoContato)
    alert('Contato salvo com sucesso!')
    formulario.reset()
    liberarCampos()
    exibirContatos()
}
//EXCLUIR CONTATO:
const excluirContato = () => {
    const cpf = prompt('Digite o CPF do contato que deseja excluir:')
    const index = contatos.findIndex(contato => contato.cpf === cpf)

    if (index !== -1) {
        contatos.splice(index, 1)
        exibirContatos()
        alert('Contato excluído com sucesso!')
    } else {
        alert('Erro: CPF não encontrado!')
    }
    
}
//EXIBIR CONTATOS:
const exibirContatos = () => {
    if(selectExibirContaos.checked){
        
        contatosCards.style.display = 'block'
        contatosCards.innerHTML = ''
    
        if (contatos.length === 0) {
            contatosCards.innerHTML = '<h4 class="fw-bolder pt-1 text-center">NENHUM CONTATO SALVO</h4>'
            return
        }
        
        contatos.forEach(contato => {
            const logradouroFormatado = contato.endereco.logradouro.split(' ')
            console.log(logradouroFormatado)
            console.log(contato.endereco.logradouro)
            contatosCards.innerHTML += `
                <div class="card mb-2">
                    <div class="card-body">
                        <h4 class="card-title text-primary">${contato.nome}</h4>
                        <p>
                            <strong>CPF:</strong> ${contato.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}<br>
                            <strong>Data de Nascimento:</strong> ${contato.dataNascimento}<br>
                        </p>
                        <h5 class="card-subtitle text-secondary-emphasis">Endereço</h5>
                        <p> 
                            ${contato.endereco.logradouro},<strong> Nº </strong>${contato.endereco.numero}, ${contato.endereco.bairro},<strong> CEP</strong>: ${contato.endereco.cep}<br>
                            ${contato.endereco.cidade} / ${contato.endereco.estado}
                        </p>
                    </div>
                </div>`
        })
        
        contatosCards.classList.remove('displayNone')
     
    }else{
        contatosCards.innerHTML = ''
        contatosCards.style.display = 'none'
    
    }
}
exibirContatos()
//AUSCULTADOR DE EXCLUIR CONTATO:
botaoExcluirContato.addEventListener('click', excluirContato)
//AUSCULTADOR DE EXIBIR CONTATOS:
document.getElementById('exibirContatos').addEventListener('click', exibirContatos)

//AUSCULTADOR DE FORM SUBMIT:
formulario.addEventListener('submit', e => {
    /* if (document.activeElement === cepInput) {
        e.preventDefault()
        console.log("Envio bloqueado porque o foco está no campo 2.")
    } */
    adicionarContato()
    e.preventDefault()
    
})

