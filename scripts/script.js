
//ELEMENTOS DO DOM COM FUNCOES:
const cepInput = document.querySelector("#cep")
const formulario = document.querySelector('#formCadastro')
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
}
const buscarCEP = async (cep)=> {
    
    cep = cep.replace(/\D/g, '') 
    if (cep.length !== 8) {
       
        console.error("CEP inválido. Por favor, insira um CEP com 8 dígitos.")
        liberarCampos();
        return;
    }
    
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`
        const response = await fetch(url);
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
        document.querySelector("#logradouro").setAttribute("readonly", true)
        document.querySelector("#bairro").setAttribute("readonly", true)
        
        //console.log("Dados do CEP:", dados)
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
        e.preventDefault(); // Impede o envio do formulário
        console.log("Envio bloqueado porque o foco está no campo 2.");
      }
    e.preventDefault()
    console.log("A submissão foi evitada.")
})
formulario.addEventListener('submit', e => {
    if (document.activeElement === cepInput) {
        e.preventDefault(); // Impede o envio do formulário
        console.log("Envio bloqueado porque o foco está no campo 2.");
      }
    e.preventDefault()
    console.log("A submissão foi evitada.")
})