
//ELEMENTOS DO DOM COM FUNCOES:
const cepInput = document.querySelector("#cep")
const formulario = document.querySelector('#formCadastro')
const estadosSelect = document.getElementById("estados")
const cidadesSelect = document.getElementById("cidades")

//URLs:
const urlEstados = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
const urlCidades = estadoId => {
    return `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`
}    
//FUNCOES ESTADOS E CIDADES:
//Estados:
async function carregarEstados() {
    try {
        const response = await fetch(urlEstados);
        const estados = await response.json();
        const estadoSiglaArray = []
        
        estados.forEach((estado)=>{
            estadoSiglaArray.push(estado.sigla)
        })
        estadoSiglaArray.sort((prev,next)=> prev>next?1:-1 )
        estadoSiglaArray.unshift('UF')
        estadoSiglaArray.forEach(estado => {
            const option = document.createElement("option")
            option.value = estado
            option.textContent = `${estado}`
            estadosSelect.appendChild(option)
        });
        
        // Carrega cidades do estado selecionado na mudanca
        estadosSelect.addEventListener("change", () => carregarCidades(estadosSelect.value));
    } catch (error) {
        console.error("Erro ao carregar estados:", error);
    }
}

//carrega estados quando inicializar a pagina:
carregarEstados()

//Cidades:
async function carregarCidades(estadoId) {
    try {
        
        cidadesSelect.innerHTML = "";
        const response = await fetch(urlCidades(estadoId));
        const cidades = await response.json();
        
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
        console.error("Erro ao carregar cidades:", error);
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
    let apenasNumeros = cep.replace(/\D/g, '');
    apenasNumeros = apenasNumeros.padStart(8, '0');
    return apenasNumeros.slice(0, 5) + '-' + apenasNumeros.slice(5);
}
const liberarCampos = () => {
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
        liberarCampos();
        return;
    }  
    try {
        const response = await fetch(urlCep);
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
//ESCUTADORES DE CEP:
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
        e.preventDefault(); 
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
//ESCUTADOR DE SUBMIT:
formulario.addEventListener('submit', e => {
    if (document.activeElement === cepInput) {
        e.preventDefault()
        console.log("Envio bloqueado porque o foco está no campo 2.");
      }
    e.preventDefault()
    console.log("A submissão foi evitada.")
})
formulario.addEventListener('submit', e => {
    if (document.activeElement === cepInput) {
        e.preventDefault(); 
        console.log("Envio bloqueado porque o foco está no campo 2.");
      }
    e.preventDefault()
    console.log("A submissão foi evitada.")
})