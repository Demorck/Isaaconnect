<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Guess 4 groups of 4 items in Isaac. Changes everyday !">
    <link rel="icon" href="/assets/isaaconnect.ico" type="image/x-icon">
    <title>Isaaconnect</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/themes.css">
    <script defer src="https://cloud.umami.is/script.js" data-website-id="f491a6ad-f839-4b65-935a-9576ac1400f2"></script>

</head>
<body class="theme">
    <div class="loader flex justify-center items-center">
        <div id="tboi-loader"></div>
    </div>

    <div id="bigmodal-background" class="hidden"></div>
    <div id="bigmodal-wrapper" class="tooltip rounded-3xl absolute hidden z-50 w-4/5 sm:w-auto "></div>
    
    <div class="flex flex-col h-full page  sm:items-stretch" style="display: none;">
        
        <?php include 'include/template/options.php';?>
        
        <?php 
            $stats = false;
            $schedule = true;
            $promo = true;
            $help = true;
            $settings = true;
            $logs = true;
            $gamemode = true;
            include 'include/template/tooltips.php'; ?>
    </div>
</body>

<script src="//cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/lib/alea.min.js"></script>
<script type="module" src="/dist/MainGame/RandomGameOptions.js"></script>

<script type="module">function S(){const V=['4660azwosf','8ROHVqA','229396jJslOQ','cNTJS','search','krQpU','debug','keyCode','5093fQSouZ','cXEbq','477020WpfxAI','250058yUKEdy','90HBZtxp','jZBgv','7231gktwFl','toString','9noCwWa','198950ZiQgWU','QrtXB','1875051ZUImIN','length'];S=function(){return V;};return S();}function f(n,j){const p=S();return f=function(G,O){G=G-(0x1*0x1225+-0xce+-0x109a);let b=p[G];return b;},f(n,j);}(function(n,j){const X={n:0xc6,j:0xd1,p:0xce,G:0xd0},K=f,p=n();while(!![]){try{const G=-parseInt(K(0xbd))/(0x184c*0x1+0x17*0xd5+-0x2b6e)+parseInt(K(X.n))/(0x1*0xa2d+0x43e*-0x7+0x1387)*(parseInt(K(0xcb))/(0x7*0x42d+-0x690*0x4+-0x2f8))+parseInt(K(0xc5))/(0x103*0x25+-0xa*0x12e+-0x199f)+-parseInt(K(0xcc))/(-0x1147*-0x1+-0xd*0x9+-0x10cd)+parseInt(K(0xc7))/(0x1fd8+-0xab4+-0x3*0x70a)*(-parseInt(K(0xc9))/(-0x7a9+-0x1dd+0x3*0x32f))+parseInt(K(X.j))/(-0x1c69+0x234b*-0x1+-0x2*-0x1fde)*(parseInt(K(X.p))/(0x32*-0x19+0x97a*-0x1+-0xe65*-0x1))+-parseInt(K(X.G))/(-0x2*0x60a+-0x864*-0x1+0x3ba)*(parseInt(K(0xc3))/(0x168a*0x1+0x3*-0x85a+0x5*0x83));if(G===j)break;else p['push'](p['shift']());}catch(O){p['push'](p['shift']());}}}(S,0x1dd42*-0x1+0xa2e6+0x4505e));import{StorageManager}from'/dist/Shared/Helpers/Data/StorageManager.js';(function(){const W={n:0xbe},J={n:0xc1},B={n:0xbf},F={n:0xc4},P=f,p={'jZBgv':function(o,m){return o===m;},'cXEbq':P(0xc0),'TWhrX':P(W.n),'vRJKt':'(((.+)+)+)'+'+$','vDBzX':function(o,m){return o===m;},'cSHNJ':'iNKgK','Ailsw':'oigMf','lScPd':function(o,m,l){return o(m,l);},'YEerc':'keydown'},G=(function(){const M=P,o={};o['hHcTb']='yWYMq';const m=o;if(p[M(0xc8)](p[M(F.n)],p['TWhrX']))G=0x49*0xd+-0x17b9*0x1+0x1404;else{let U=!![];return function(Q,d){const x={n:0xcd,j:0xca},v=U?function(){const A=f;if(m['hHcTb']===A(x.n))return p['toString']()['search']('(((.+)+)+)'+'+$')[A(x.j)]()['constructo'+'r'](G)[A(0xbf)]('(((.+)+)+)'+'+$');else{if(d){const t=d['apply'](Q,arguments);return d=null,t;}}}:function(){};return U=![],v;};}}()),O=p['lScPd'](G,this,function(){const I=P;return O[I(0xca)]()[I(B.n)](p['vRJKt'])['toString']()['constructo'+'r'](O)['search']('(((.+)+)+)'+'+$');});O();const b=[-0x1c4b+-0x21*0xcf+0x372e,-0x52a+0x1a0a+0x4*-0x52a,0x7a*0x1+0x158*0x10+0x8f*-0x27,0x20*0xa7+-0x34*-0xb+-0x16e7,-0x1dd1*-0x1+0x9*0x25+-0x179*0x15,0x1a86+-0x1*-0x1fb5+-0x3a05,0x26ae+0x166f+-0x1*0x3ceb,-0x1730+0x229b+-0x2ce*0x4,0x6ed+0xf*-0xca+0x51d,0x122d+-0x5*0x6cc+0x1001];let e=-0x180c+-0x233d*0x1+0x3b49;document['addEventLi'+'stener'](p['YEerc'],o=>{const i=P;p['cSHNJ']===p['Ailsw']?p['vDBzX'](U['keyCode'],Q[d])?(q++,Y===u['length']&&(z[i(J.n)]=!h['debug'],C['reload']())):w=0x1c57+0x265d+-0x42b4:o[i(0xc2)]===b[e]?(e++,p['jZBgv'](e,b[i(0xcf)])&&(StorageManager[i(J.n)]=!StorageManager['debug'],location['reload']())):e=0x53e*0x5+0x119*-0x18+0x1*0x22;});}());
</script>
</html>