// Importações necessárias
const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicializa o app Express
const app = express();

// Configurações de CORS
const corsOptions = {
   origin: '*',
   credentials: true,
   optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Configuração de middlewares
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Inicializa o cliente Supabase
const supabase = supabaseClient.createClient(
    'https://rfnbtrcfebowskzyrlwv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmbmJ0cmNmZWJvd3NrenlybHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NTM1MzIsImV4cCI6MjA0NjMyOTUzMn0.L0e_YC6hI2YS0S6VOr5LcPP5ER4YEbMpbL57gQMfnZk'
);

// Endpoints do CRUD

// 1. Listar todos os produtos (GET /products)
app.get('/products', async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').select();
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Consultar um produto por ID (GET /products/:id)
app.get('/products/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select()
            .eq('id', req.params.id)
            .single(); // Retorna apenas um registro
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ error: 'Product not found' });
    }
});

// 3. Criar um novo produto (POST /products)
app.post('/products', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const { error } = await supabase.from('products').insert({ name, description, price });
        if (error) throw error;
        res.status(201).send('Product created successfully!');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. Atualizar um produto por ID (PUT /products/:id)
app.put('/products/:id', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const { error } = await supabase
            .from('products')
            .update({ name, description, price })
            .eq('id', req.params.id);
        if (error) throw error;
        res.status(200).send('Product updated successfully!');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 5. Deletar um produto por ID (DELETE /products/:id)
app.delete('/products/:id', async (req, res) => {
    try {
        const { error } = await supabase.from('products').delete().eq('id', req.params.id);
        if (error) throw error;
        res.status(200).send('Product deleted successfully!');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota raiz para verificar o funcionamento do servidor
app.get('/', (req, res) => {
    res.send('Welcome to the Supabase CRUD API!');
});

// Rota para lidar com endpoints não encontrados
app.get('*', (req, res) => {
    res.status(404).send('Route not found');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log(`> Server is running on http://localhost:3000`);
});
