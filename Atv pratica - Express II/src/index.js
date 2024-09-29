import express from 'express'
import bcrypt from 'bcrypt'

const app = express()

app.use(express.json())

const veiculos = [
    {
        id: 1,
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2012 ,
        cor: 'Azul' ,
        preco: 40000
    },
    {
        id: 2,
        modelo: 'Fiesta',
        marca: 'Ford',
        ano: 2012 ,
        cor: 'Preto' ,
        preco: 35000
    },
    {
        id: 3,
        modelo: 'Type',
        marca: 'Fiat',
        ano: 2001 ,
        cor: 'Rosa' ,
        preco: 25000
    }
]

const usuarios = []

// app.get('/veiculos', (req, res) => {
//     if (veiculos.length === 0) {
//         return res.status(404).json({
//             message: 'nenhum usuario encontrado.'
//         })
//     }

//     return res.json(veiculos)
// })

app.get('/veiculos', (req, res) => {
    const { marca } = req.query

    let veiculosFiltrados

    if (veiculos.length === 0) {
        return res.status(404).json({
            message: 'nenhum veiculo encontrado.'
        })
    }

    if (marca) {
        veiculosFiltrados = veiculos.filter(veiculo => veiculo.marca.toLocaleLowerCase() === marca).map(veiculo => ({
            id: veiculo.id,
            modelo: veiculo.modelo,
            cor: veiculo.cor,
            preco: veiculo.preco
        }))
    } else {
        veiculosFiltrados = veiculos
    }

    return res.status(200).json({
        message: 'lista de veiculos',
        veiculosFiltrados
    })
})

app.post('/veiculos', (req, res) => {
    const { modelo, marca, ano, cor, preco } = req.body

    if (!modelo || !marca || !ano || !cor || !preco) {
        return res.status(400).json({
            message: 'Todos os campos precisam ser preenchidos.'
        })
    }

    const novoVeiculo = {
        id: veiculos.length + 1,
        modelo,
        marca,
        ano,
        cor,
        preco
    }

    veiculos.push(novoVeiculo)

    return res.status(201).json({
        message: 'Veiculo criado com sucesso.'
    })
})

app.put('/veiculos/:id', (req, res) => {
    const { id } = req.params
    const { cor, preco } = req.body

    const veiculo = veiculos.find(veiculo => veiculo.id === parseInt(id))

    if (!veiculo) {
        return res.status(404).json({
            message: 'Veículo, não encontrado. O usuário deve voltar para o menu inicial depois'
        })
    }

    veiculo.cor = cor
    veiculo.preco = preco

    return res.status(200).json({
        message: 'Veiculo atualizado com sucesso.',
        veiculo
    })
})

app.delete('/veiculos/:id', (req, res) => {
    const { id } = req.params

    const veiculosIndice = veiculos.findIndex(veiculo => veiculo.id === parseInt(id))

    if (veiculosIndice === -1) {
        return res.status(404).json({
            message: 'nenhum usuario encontrado.'
        })
    }

    const [veiculoDeletado] = veiculos.splice(veiculosIndice, 1)

    return res.status(200).json({
        message: 'Veiculo deletado com sucesso.',
        veiculoDeletado
    })
})

app.post('/signup', async (req, res) => {
    try {
        const { name, username, password } = req.body

        const senhaCriptografada = await bcrypt.hash(password, 10)

        const usuarioExiste = usuarios.find(usuario => usuario.username === username)

        if (!name || !username || !password) {
            return res.json({
                message: 'Todos os campos sao obrigatorios.'
            })
        }

        if (usuarioExiste) {
            return res.status(400).json({
                message: 'usuario ja existe.'
            })
        }

        const novoUsuario = {
            name,
            username,
            password: senhaCriptografada
        }

        usuarios.push(novoUsuario)

        return res.status(201).json({
            message: 'Usuario criado com sucesso.',
            novoUsuario
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao registrar usuario',
            error
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const usuario = usuarios.find(usuario => usuario.username === username)

        if (!username || !password) {
            return res.json({
                message: 'Todos os campos sao obrigatorios.'
            })
        }

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario nao encontrado.'
            })
        }

        const isMatch = await bcrypt.compare(password, usuario.password)

        if (!isMatch){
            return res.status(400).json({
                message: 'usuario ou senha incorretos.'
            })
        }

        return res.status(200).json({
            message: 'login efetuado com sucesso.'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao registrar usuario',
            error
        })
    }
})

app.listen(3333, () => {
    console.log('server rodando na porta 3333')
})