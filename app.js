const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')



const flujoPedido = addKeyword(['Hola','Buenos días', 'Buenas', '¿Cómo estás?', 'Saludos', '¡Hola, bot!',
    'Hola, ¿estás ahí?', 'Iniciar conversación', 'Empezar chat', '¿Qué tal?', 'Hey', '¿Hola, qué haces?', 'Buen día',
    'Buenas tardes', 'Buenas noches', 'Hello', 'Hi', '¿Hay alguien?', '¿Puedo preguntar algo?',
    'Hola, ¿me puedes ayudar?', 'buenas', 'hola']).addAnswer('🙌 Hola bienvenido a la Freseria🍓').addAnswer(['Sigue este enlace para ver nuestro catálogo en WhatsApp: https://wa.me/c/573134190482','A continuación te preguntaremos los detalles de tu pedido 💌'])
    .addAnswer(['¿Qué deseas ordenar?', 'Recuerda escribir todos los productos que deseas ordenar en un solo mensaje'], { capture: true }, async (ctx, { state, flowDynamic }) => {
        const pedidoCapturado = ctx.body;
        console.log('Pedido capturado:', pedidoCapturado);
        await state.update({ pedido: pedidoCapturado });

    }).addAnswer(null, null, async (_, { flowDynamic, state }) => {
        const myState = state.getMyState()
        await flowDynamic(`Confirmación del pedido: \n${myState.pedido}`)
    }).addAnswer(['¿Confirmas tu pedido? Escribe si o no  de acuerdo a la opción que deseas escoger #️⃣', 'Si ✅','No ❌'],{capture:true},async(ctx, {state, flowDynamic, gotoFlow}) => {

        console.log('...')

        if(ctx.body ==='No' || ctx.body ==='no'){
            await state.clear(['name', 'dir']);
            return gotoFlow(flujoPedido)
        }else if (ctx.body ==='Si'|| ctx.body ==='si'){
            await flowDynamic(`Productos registrados`)
            return gotoFlow(flujoDatosPedido)
        }

    })

const flujoDatosPedido = addKeyword(['Si', 'si', 'SI'])

    .addAnswer('¿Cual es tu nombre?', { capture: true }, async (ctx, { state, flowDynamic }) => {
        const nombreCapturado = ctx.body;
        console.log('Nombre capturado:', nombreCapturado);
        await state.update({ name: nombreCapturado });
    })
    .addAnswer('¿Cual es tu direccion?', { capture: true }, async (ctx, { state, flowDynamic }) => {
        const direccionCapturada = ctx.body;
        console.log('Dirección capturada:', direccionCapturada);
        await state.update({ dir: direccionCapturada });
    }).addAnswer('Tus datos son:', null, async (_, { flowDynamic, state }) => {
        const myState = state.getMyState()
        await flowDynamic(`Nombre: ${myState.name} \nDirección: ${myState.dir}`)
    }).addAnswer(['¿Confirmas tus datos? Escribe  si o no dependiendo la opción que deseas escoger #️⃣', 'Si ✅','No ❌'],{capture:true},async(ctx, {state, flowDynamic, gotoFlow}) => {

        console.log('...')


        if(ctx.body ==='No' || ctx.body ==='no'){
            await state.clear(['name', 'dir']);
            return gotoFlow(flujoDatosPedido)
        }else if (ctx.body ==='Si'|| ctx.body ==='si'){
            return gotoFlow(flujoConfirmacion)
        }

    })


const flujoConfirmacion = addKeyword(['si', 'Si', 'SI']).addAnswer('Resumen de tu pedido confirmado:', null, async (_, { flowDynamic, state })=>{
    const myState = state.getMyState()
    await flowDynamic(`🍓Productos de tu orden:\n ${myState.pedido} \n \n📖Datos Domicilio: \nNombre: ${myState.name} \nDirección: ${myState.dir}`)
}).addAnswer('¿Necesitas algo más?:  \n1. Si, deseo volver al menú  \n2. No, muchas gracias', {capture:true}, async (ctx, { flowDynamic, state })=>{
    if(ctx.body === '1' || ctx.body === 'Si' || ctx.body === 'si'){
        //return gotoFlow()
    }
    else if (ctx.body === '2' || ctx.body === 'No' || ctx.body === 'no'){
        await flowDynamic ('¡Muchisimas gracias! Ten lindo día')
    }
})







const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flujoDatosPedido, flujoPedido, flujoConfirmacion]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });


    QRPortalWeb();
};

main();


