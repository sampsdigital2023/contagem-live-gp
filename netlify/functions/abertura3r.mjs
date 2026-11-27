// 3R Capacita - abertura comemorativa: mensagem fixa + feixes de luz, faiscas e confetes verdes
// GET /abertura-3r.gif
import {inflateSync} from 'node:zlib';
const W=600,H=220,N=W*H,F=60,DELAY=8;
// paleta: 0 fundo, 1..15 fundo->lima, 16..21 lima->branco
const BG=[7,8,7],LIME=[205,235,31],WH=[255,255,255];
const lerp=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const PAL=[BG];for(let i=1;i<=15;i++)PAL.push(lerp(BG,LIME,i/15));for(let i=1;i<=6;i++)PAL.push(lerp(LIME,WH,i/6));
for(let i=1;i<=9;i++)PAL.push(lerp(BG,WH,i/9)); // 22..30 cinza->branco (texto)
const TR=PAL.length;while(PAL.length<32)PAL.push([0,0,0]);
const LV=t=>{t=Math.max(0,Math.min(1,t));return Math.round(t*21);}; // 0..1 -> indice (0 fundo, 15 lima, 21 branco)
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
const conf=[],rain=[],sparks=[];
for(let s=0;s<3;s++)for(let i=0;i<26;i++){const d=.5+rnd()*.7;const ang=s===2?(-70-rnd()*40)*Math.PI/180:(-38-rnd()*48)*Math.PI/180;
  conf.push({s,d,del:rnd()*4,ang,sp:(13+rnd()*13)*d,w:(5+rnd()*4)*d,h:(8+rnd()*6)*d,r0:rnd()*6.3,spin:(rnd()-.5)*.5,fs:.5+rnd()*.5,fo:rnd()*6,sw:rnd()*6,white:rnd()<.25});}
for(let i=0;i<30;i++){const d=.45+rnd()*.6;rain.push({d,cy:d>.8?2:1,o:rnd(),x:rnd()*W,ph:rnd()*6,w:(4+rnd()*3)*d,h:(7+rnd()*4)*d,r0:rnd()*6.3,fo:rnd()*6,white:rnd()<.3});}
for(let i=0;i<22;i++)sparks.push({x:20+rnd()*(W-40),y:15+rnd()*(H-30),ph:rnd(),sz:3+rnd()*5});
const MASK=inflateSync(Buffer.from('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','base64')); // nibble baixo: verde, alto: branco
function text(px){for(let i=0;i<N;i++){const m=MASK[i];if(!m)continue;const l=m&15,w=m>>4;
  if(w>l)px[i]=21+Math.round(w/15*9);else px[i]=Math.round(l/15*15);}}
function put(px,x,y,v){if(x<0||y<0||x>=W||y>=H)return;const i=y*W+x;if(v>px[i])px[i]=v;}
function rect(px,cx,cy,hw,hh,a,flip,white){const sy=Math.max(.15,Math.abs(flip)),c=Math.cos(a),s=Math.sin(a),R=Math.ceil(Math.max(hw,hh))+1;
  const v=white?21:Math.round(8+Math.pow(Math.abs(flip),2)*10);
  for(let y=Math.floor(cy-R);y<=cy+R;y++)for(let x=Math.floor(cx-R);x<=cx+R;x++){const dx=x-cx,dy=y-cy,u=dx*c+dy*s,w=-dx*s+dy*c;
    if(Math.abs(u)<=hw&&Math.abs(w)<=hh*sy&&x>=0&&y>=0&&x<W&&y<H)px[y*W+x]=v;}}
function frame(f){const t=f/F,px=new Uint8Array(N);
  // feixes diagonais que atravessam a tela (2 por ciclo)
  for(const [off,slope,str] of [[0,0.45,1],[0.5,-0.5,.8]]){const p=((t+off)%1);const x0=-200+p*(W+400);
    for(let y=0;y<H;y++){const xc=x0+(y-H/2)*slope*-1;for(let x=Math.max(0,Math.floor(xc-16));x<Math.min(W,xc+16);x++){const d=Math.abs(x-xc);
      const v=d<1.2?str:str*Math.exp(-d/5)*.5;put(px,x,y,LV(v*0.85));}}}
  // faiscas (estrelas de 4 pontas piscando)
  for(const s of sparks){const b=Math.max(0,Math.sin((t*2+s.ph)*6.283));if(b<.05)continue;const L=Math.round(s.sz*b);
    for(let k=-L;k<=L;k++){const v=LV((1-Math.abs(k)/(L+1))*b+.05);put(px,Math.round(s.x+k),Math.round(s.y),v);put(px,Math.round(s.x),Math.round(s.y+k),v);}
    put(px,Math.round(s.x),Math.round(s.y),21);}
  // chuva leve e explosao de confetes (cantos e centro de baixo)
  for(const p of rain){const ph=t*p.cy,pr=(ph+p.o)%1,y=-15+pr*(H+30),x=p.x+Math.sin(ph*6.283+p.ph)*8;
    rect(px,x,y,p.w/2,p.h/2,p.r0+Math.sin(ph*6.283+p.ph)*1.2,Math.cos(ph*6.283*3+p.fo),p.white);}
  for(const p of conf){const tt=f-p.del;if(tt<=0)continue;const k=.09,dm=(1-Math.exp(-k*tt))/k;
    const ox=p.s===0?-5:p.s===1?W+5:W/2,dir=p.s===1?-1:1,xs=p.s===2?(rnd2(p)-.5)*2:dir;
    const x=ox+Math.cos(p.ang)*p.sp*xs*dm+Math.sin(tt*.35+p.sw)*5*p.d,y=H+8+Math.sin(p.ang)*p.sp*dm+.5*p.d*tt*tt*.3;
    if(y>H+20)continue;rect(px,x,y,p.w/2,p.h/2,p.r0+tt*p.spin,Math.cos(tt*p.fs+p.fo),p.white);}
  text(px);
  return px;}
function rnd2(p){return (Math.sin(p.fo*12.9898)*43758.5453)%1<0?-(Math.sin(p.fo*12.9898)*43758.5453)%1:(Math.sin(p.fo*12.9898)*43758.5453)%1;}
function lzw(px){const mc=5,clear=32,eoi=33,out=[];let cur=0,bits=0,size=6,next=34,dict=new Map();
  const put=c=>{cur|=c<<bits;bits+=size;while(bits>=8){out.push(cur&255);cur>>>=8;bits-=8;}};
  put(clear);let pre=px[0];
  for(let i=1;i<px.length;i++){const k=px[i],key=pre*256+k,v=dict.get(key);if(v!==undefined){pre=v;continue;}
    put(pre);if(next<4096){dict.set(key,next++);if(next>(1<<size)&&size<12)size++;}else{put(clear);dict=new Map();size=6;next=34;}pre=k;}
  put(pre);put(eoi);if(bits>0)out.push(cur&255);
  const b=[mc];for(let i=0;i<out.length;i+=255){const ch=out.slice(i,i+255);b.push(ch.length,...ch);}b.push(0);return b;}
function build(){const b=[...Buffer.from('GIF89a'),W&255,W>>8,H&255,H>>8,0xF4,0,0];PAL.forEach(c=>b.push(...c));
  b.push(0x21,0xFF,11,...Buffer.from('NETSCAPE2.0'),3,1,0,0,0);let prev=null;
  for(let f=0;f<F;f++){const cur=frame(f);let px=cur,tt=0;
    if(prev){px=new Uint8Array(N);for(let i=0;i<N;i++)px[i]=cur[i]===prev[i]?TR:cur[i];tt=1;}
    b.push(0x21,0xF9,4,(1<<2)|tt,DELAY,0,TR,0,0x2C,0,0,0,0,W&255,W>>8,H&255,H>>8,0);const e=lzw(px);for(let i=0;i<e.length;i++)b.push(e[i]);prev=cur;}
  b.push(0x3B);return Buffer.from(b);}
let CACHE=null;
export default async()=>{if(!CACHE)CACHE=build();
  return new Response(CACHE,{headers:{'Content-Type':'image/gif','Cache-Control':'public, max-age=86400','Netlify-CDN-Cache-Control':'public, max-age=31536000, durable'}});};
export const config={path:'/abertura-3r.gif'};
