require('dotenv').config();
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Cargado ✅' : 'No cargado ❌');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); 

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', async (req, res) => {
    console.log('🔹 Headers:', req.headers);  // pa ver los headers de la petisao
    console.log('🔹 Body recibido:', JSON.stringify(req.body, null, 2));  // pa ver los datos recibidos
    const { nombre, apellido, email, telefono, especialidad, profesion, estudio, horarios, pais, estado, calle, numero, codigo_postal, mensaje, consultorios } = req.body;

    const listaConsultorios = Array.isArray(consultorios) ? consultorios : [];

    if (!nombre || !apellido || !email || !telefono || !especialidad || !profesion || !estudio || !horarios || !pais || !estado || !calle || !numero || !codigo_postal || !mensaje) {
        console.log('❌ ERROR: El body está vacío o con undefined');
    }

    console.log('✅ Datos de los consultorios recibidos:', listaConsultorios);

    res.json({ message: 'Revisión de datos en consola' });

    console.log('Datos recibidos:', req.body); 

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, 
        subject: 'Nuevo Mensaje del Formulario',
        text: 
        `📩 Nuevo mensaje de contacto
        
        🔹 Nombre: ${nombre}
        🔹 Apellido: ${apellido}
        🔹 Correo electrónico: ${email}
        🔹 Teléfono/Celular: ${telefono}
        🔹 Especialidad: ${especialidad}
        🔹 Profesión: ${profesion}
        🔹 ¿Dónde estudiaste?: ${estudio} 
        🔹 Mensaje: ${mensaje}
    
        🏥 Consultorio 1:
        🔹 Horarios: ${horarios}
        🔹 País: ${pais}
        🔹 Estado/Provincia: ${estado}
        🔹 Calle: ${calle} - Número: ${numero}
        🔹 Código Postal: ${codigo_postal}
        
        ${consultorios.length >= 1 ? `
        🏥 Consultorio 2:
        🔹 Horarios: ${consultorios[0].horarios || 'No especificado'}
        🔹 País: ${consultorios[0].pais || 'No especificado'}
        🔹 Estado/Provincia: ${consultorios[0].estado || 'No especificado'}
        🔹 Calle: ${consultorios[0].calle || 'No especificado'} - Número: ${consultorios[0].numero || 'No especificado'}
        🔹 Código Postal: ${consultorios[0].codigo_postal || 'No especificado'}
        ` : ''}
    
        ${consultorios.length >= 2 ? `
        🏥 Consultorio 3:
        🔹 Horarios: ${consultorios[1].horarios || 'No especificado'}
        🔹 País: ${consultorios[1].pais || 'No especificado'}
        🔹 Estado/Provincia: ${consultorios[1].estado || 'No especificado'}
        🔹 Calle: ${consultorios[1].calle || 'No especificado'} - Número: ${consultorios[1].numero || 'No especificado'}
        🔹 Código Postal: ${consultorios[1].codigo_postal || 'No especificado'}
        ` : ''}
    
        ${consultorios.length >= 3 ? `
        🏥 Consultorio 4:
        🔹 Horarios: ${consultorios[2].horarios || 'No especificado'}
        🔹 País: ${consultorios[2].pais || 'No especificado'}
        🔹 Estado/Provincia: ${consultorios[2].estado || 'No especificado'}
        🔹 Calle: ${consultorios[2].calle || 'No especificado'} - Número: ${consultorios[2].numero || 'No especificado'}
        🔹 Código Postal: ${consultorios[2].codigo_postal || 'No especificado'}
        ` : ''}
    
        ${consultorios.length >= 4 ? `
        🏥 Consultorio 5:
        🔹 Horarios: ${consultorios[3].horarios || 'No especificado'}
        🔹 País: ${consultorios[3].pais || 'No especificado'}
        🔹 Estado/Provincia: ${consultorios[3].estado || 'No especificado'}
        🔹 Calle: ${consultorios[3].calle || 'No especificado'} - Número: ${consultorios[3].numero || 'No especificado'}
        🔹 Código Postal: ${consultorios[3].codigo_postal || 'No especificado'}
        ` : ''}`
    };    

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado con éxito');
        res.json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo', error });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});