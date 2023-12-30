const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


const flujoPasteles = addKeyword(['1','Pasteles']).addAnswer(
    [
        'Escriba el número de la opción que desea elegir',
        '🥧 1. Tarta Zanahoria',
        '🥨 2. Torta amapola',
        '🥯 3. Cheescake',
    ]
)

const flujoBebidas = addKeyword(['2','Bebidas']).addAnswer(
    [
        'Escriba el número de la opción que desea elegir',
        '☕ 1. Cafe',
        '🍧 2. Granizado Café',
        '🥤 3. Bretaña',
    ]
)


const flujoFresas = addKeyword(['3','Fresas']).addAnswer(
    [
        'Escriba el número de la opción que desea elegir',
        '🎂 1. Brownie con helado de fresa',
        '🍰 2. Fresas con chocolate',
        '🍓 3. Fresas con crema',
    ]
)

const flujoMenu = addKeyword(['3', 'menú', '1']).addAnswer(
    [
        'Escriba el número de la opción que desea elegir',
        '🥧 1. Pasteles',
        '☕ 2. Bebidas',
        '🍓 3. Cositas con fresas',
    ],
    null,
    null,
    [flujoPasteles,flujoBebidas,flujoFresas]
)


const flujoYaSePedir = addKeyword(['2','Ya sé que pedir'])
    .addAnswer('¿Cual es tu nombre?', {capture: true}, async (ctx, { state }) => {
        const nombreCapturado = ctx.body;
        console.log('Nombre capturado:', nombreCapturado);

        // Asegúrate de que se está llamando a la siguiente pregunta
        console.log('Llamando a la siguiente pregunta...');

        await state.update({ name: nombreCapturado });
    })
    .addAnswer('¿Cual es tu direccion?', {capture: true}, async (ctx, { state }) => {
        const direccionCapturada = ctx.body;
        console.log('Dirección capturada:', direccionCapturada);
        await state.update({ dir: ctx.body })
    })

const flowDomicilio = addKeyword(['domicilio', 'Domicilio', '1']).addAnswer(
    [
        '📄 1. Consultar Menú',
        '📇 2. Ya sé que pedir',
    ],
    null,
    null,
    [flujoYaSePedir, flujoMenu]
)

// Crear flujo principal
const flowPrincipal = addKeyword(['Hola','Buenos días', 'Buenas', '¿Cómo estás?', 'Saludos', '¡Hola, bot!',
    'Hola, ¿estás ahí?', 'Iniciar conversación', 'Empezar chat', '¿Qué tal?', 'Hey', '¿Hola, qué haces?', 'Buen día',
    'Buenas tardes', 'Buenas noches', 'Hello', 'Hi', '¿Hay alguien?', '¿Puedo preguntar algo?',
    'Hola, ¿me puedes ayudar?', 'buenas', 'hola','1']).addAnswer('🙌 Hola bienvenido a la Freseria').addAnswer(
        [
            'Escribe un mensaje con el número de la opción que desees:',
            '👉 *1*  Domicilios',
            '👉 *2*  Recoger pedido en tienda',
            '👉 *3*  Ver menú',

        ],
        null,
        null,
        [flujoYaSePedir,flowDomicilio,flujoMenu]
)




const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();


