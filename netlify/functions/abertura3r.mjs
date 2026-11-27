// 3R Capacita - abertura comemorativa (sem texto): feixes de luz, faiscas e confetes verdes
// GET /abertura-3r.gif
const W=600,H=220,N=W*H,F=60,DELAY=8;
// paleta: 0 fundo, 1..15 fundo->lima, 16..21 lima->branco
const BG=[7,8,7],LIME=[205,235,31],WH=[255,255,255];
const lerp=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const PAL=[BG];for(let i=1;i<=15;i++)PAL.push(lerp(BG,LIME,i/15));for(let i=1;i<=6;i++)PAL.push(lerp(LIME,WH,i/6));
const TR=PAL.length;while(PAL.length<32)PAL.push([0,0,0]);
const LV=t=>{t=Math.max(0,Math.min(1,t));return Math.round(t*21);}; // 0..1 -> indice (0 fundo, 15 lima, 21 branco)
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
const conf=[],rain=[],sparks=[];
for(let s=0;s<3;s++)for(let i=0;i<26;i++){const d=.5+rnd()*.7;const ang=s===2?(-70-rnd()*40)*Math.PI/180:(-38-rnd()*48)*Math.PI/180;
  conf.push({s,d,del:rnd()*4,ang,sp:(13+rnd()*13)*d,w:(5+rnd()*4)*d,h:(8+rnd()*6)*d,r0:rnd()*6.3,spin:(rnd()-.5)*.5,fs:.5+rnd()*.5,fo:rnd()*6,sw:rnd()*6,white:rnd()<.25});}
for(let i=0;i<30;i++){const d=.45+rnd()*.6;rain.push({d,cy:d>.8?2:1,o:rnd(),x:rnd()*W,ph:rnd()*6,w:(4+rnd()*3)*d,h:(7+rnd()*4)*d,r0:rnd()*6.3,fo:rnd()*6,white:rnd()<.3});}
for(let i=0;i<22;i++)sparks.push({x:20+rnd()*(W-40),y:15+rnd()*(H-30),ph:rnd(),sz:3+rnd()*5});
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
