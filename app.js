const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')



 

const flowGracias = addKeyword(['gracias', 'grac','Gracias','Muchas gracias', 'Muchísimas gracias','Muchisimas gracias']).addAnswer(
    [
        '🚀 En la freseria estamos para servirte, esperamos hayas tenido un buen servicio',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '\n*1* Para siguiente reiniciar.',
    ]
)


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

const flujoYaSePedir = addKeyword(['2', 'Ya sé que pedir'])
    .addAction(async (_, { flowDynamic }) => {
        return await flowDynamic('Escribe la dirección donde deseas recibir tu pedido')
    })
    .addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
        await state.update({ direccion: ctx.body })
        return await flowDynamic(`Dirección ingresada: ${ctx.body}`)
    })

const flowDomicilio = addKeyword(['domicilio', 'Domicilio', '1']).addAnswer(
    [
        '📄 1. Consultar Menú',
        '📇 2. Ya sé que pedir',
    ],
    null,
    null,
    [flowGracias, flujoMenu,flujoYaSePedir]
)


const flowPrincipal = addKeyword(['Hola','Buenos días', 'Buenas', '¿Cómo estás?', 'Saludos', '¡Hola, bot!',
'Hola, ¿estás ahí?', 'Iniciar conversación', 'Empezar chat', '¿Qué tal?', 'Hey', '¿Hola, qué haces?', 'Buen día', 
'Buenas tardes', 'Buenas noches', 'Hello', 'Hi', '¿Hay alguien?', '¿Puedo preguntar algo?', 
'Hola, ¿me puedes ayudar?', 'buenas', 'hola','1'])
    .addAnswer('🙌 Hola bienvenido a la Freseria')
    .addAnswer(
        [
            'Escribe un mensaje con el número de la opción que desees:',
            '👉 *1*  Domicilios',
            '👉 *2*  Recoger pedido en tienda',
            '👉 *3*  Ver Menú',
        ],
        null,
        null,
        [flowDomicilio, flowGracias,flujoMenu]
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


