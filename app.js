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
    {capture:true},
    async (ctx,{flowDynamic,gotoFlow})=>{
        const opcion =parseInt( ctx.body);
        switch (opcion){
            case 1: return gotoFlow(flujoPasteles)
            case 2: return gotoFlow(flujoBebidas)
            case 3: return gotoFlow(flujoFresas)
        }
    }

)


const flujoYaSePedir = addKeyword(['2', 'Ya sé que pedir'])

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
    }).addAnswer(['¿Confirmas tus datos? Escribe el número de la opción que deseas escoger #️⃣', '1. Si ✅','2. No ❌'],{capture:true},async(ctx, {state, flowDynamic, gotoFlow}) => {

        console.log('...')


        if(ctx.body === '2' || ctx.body ==='No' || ctx.body ==='no'){
             await state.clear(['name', 'dir']);
             return gotoFlow(flujoYaSePedir)
        }else if (ctx.body ==='Si'|| ctx.body ==='si' || ctx.body ==='1'){
            await flowDynamic(`Ya te registramos..`)
        }

    })




const flowDomicilio = addKeyword(['domicilio', 'Domicilio', '1']).addAnswer(
    [
        '📄 1. Consultar Menú',
        '📇 2. Ya sé que pedir',
    ],
    {capture:true},
    async(ctx,{flowDynamic,gotoFlow})=>{
        const opcion =parseInt( ctx.body);
        switch (opcion){
            case 1: return gotoFlow(flujoMenu)
            case 2: return gotoFlow(flujoYaSePedir)
        }
    }
)

// Crear flujo principal
const flowPrincipal = addKeyword(['Hola','Buenos días', 'Buenas', '¿Cómo estás?', 'Saludos', '¡Hola, bot!',
    'Hola, ¿estás ahí?', 'Iniciar conversación', 'Empezar chat', '¿Qué tal?', 'Hey', '¿Hola, qué haces?', 'Buen día',
    'Buenas tardes', 'Buenas noches', 'Hello', 'Hi', '¿Hay alguien?', '¿Puedo preguntar algo?',
    'Hola, ¿me puedes ayudar?', 'buenas', 'hola','1']).addAnswer('🙌 Hola bienvenido a la Freseria🍓').addAnswer(
        [
            'Escribe un mensaje con el número de la opción que desees:',
            '👉 *1*  Domicilios',
            '👉 *2*  Recoger pedido en tienda',
            '👉 *3*  Ver menú',

        ],
        {capture:true},
        async(ctx, {flowDynamic, gotoFlow}) =>{

            const opcion = parseInt(ctx.body);
            console.log(opcion)
            switch (opcion){
                case 1: return gotoFlow(flowDomicilio);
                case 2: return gotoFlow(flujoYaSePedir);
                case 3: return gotoFlow(flujoMenu);
            }

         }
)




const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal, flujoMenu,flowDomicilio,flujoYaSePedir,flujoFresas,flujoPasteles,flujoBebidas]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();


