(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,27799,e=>{"use strict";var t=e.i(8560),a=e.i(90072),o=e.i(56385),l=e.i(17724),i=e.i(13125),r=e.i(4342),u=e.i(41116),n=e.i(60138),s=e.i(46869),d=e.i(17843),v=e.i(47333),c=e.i(82035);let h=`
uniform vec2 u_center;   // the plane's centre, world
uniform vec2 u_res;      // the plane's size, world
uniform float u_H;       // frustum half-height at z = 0
uniform float u_camZ;    // the camera's z (it sits on the z axis, looking down −z)

uniform float u_V;       // scroll speed 0..1
uniform float u_twist;   // edge twist at V = 1, rad
uniform float u_rear;    // rear-up at V = 1, \xd7 u_H
uniform float u_sag;     // cloth sag at V = 1, \xd7 plane height

uniform float u_roll;    // reveal front, 0 (all rolled) … 1 (flat)
uniform float u_rollR;   // roll radius, world
uniform float u_wind;    // S lift at the top edge, \xd7 plane height (signed)
uniform float u_dome;    // flight bulge, world

uniform float u_hover;
uniform vec2 u_mouse;    // dent centre, plane uv
uniform float u_dent;    // dent depth at the centre, world
uniform float u_dentR;   // gaussian 1/e radius, \xd7 plane height
uniform float u_dentE;   // flat border band, \xd7 plane height

varying vec2 vUv;
varying vec3 vN;
varying float vZ;
varying float vAlpha;

const float PI = 3.141592653589793;

// the ribbon's dentEdge / dentField, the band and radius passed in
float edgeQ(float x, float span, float band) {
	float a = clamp(x * span / band, 0.0, 1.0);
	float b = clamp((1.0 - x) * span / band, 0.0, 1.0);
	return a * a * a * (a * (a * 6.0 - 15.0) + 10.0) * b * b * b * (b * (b * 6.0 - 15.0) + 10.0);
}
float dentF(vec2 uv) {
	if (u_hover < 0.0001) return 0.0;
	float asp = u_res.x / max(u_res.y, 0.0001);
	vec2 d = (uv - u_mouse) * vec2(asp, 1.0);
	float r2 = max(u_dentR * u_dentR, 0.0001);
	float m = edgeQ(uv.x, asp, u_dentE) * edgeQ(uv.y, 1.0, u_dentE);
	float am = 0.5 + 0.5 * edgeQ(u_mouse.x, asp, u_dentE * 1.8) * edgeQ(u_mouse.y, 1.0, u_dentE * 1.8);
	return am * exp(-dot(d, d) / r2) * m;
}
float dome(vec2 uv) { vec2 q = uv * 2.0 - 1.0; return (1.0 - q.x * q.x) * (1.0 - q.y * q.y); }

// the plane's own frame: x, y relative to the centre, z toward the camera
vec3 deform(vec2 uv, out float th) {
	vec3 p = vec3((uv - 0.5) * u_res, 0.0);
	th = 0.0;

	p.z -= u_hover * u_dent * dentF(uv);

	// roll: arc length past the front, wrapped round the cylinder
	if (u_roll < 0.9999 && uv.y > u_roll) {
		float s = (uv.y - u_roll) * u_res.y;
		float R = max(u_rollR, 0.0001);
		th = s / R;
		float y0 = (u_roll - 0.5) * u_res.y;
		p.y = y0 + R * sin(th);
		p.z += R * (1.0 - cos(th));
	}

	if (abs(u_wind) > 0.0001) {
		// the S lift L, applied along the ray camera → vertex: the point comes closer by L in z (or falls away) but
		// stays on its ray, so its screen position — the plane's silhouette — is unchanged
		float t = smoothstep(0.25, 1.0, uv.y);
		float b = 1.0 - smoothstep(0.0, 0.45, uv.y);
		float L = u_wind * u_res.y * (t * t - 0.33 * b * b);
		vec3 W = vec3(u_center + p.xy, p.z);
		vec3 C = vec3(0.0, 0.0, u_camZ);
		W = C + (W - C) * (1.0 - L / max(u_camZ - W.z, 0.001));
		p = vec3(W.xy - u_center, W.z);
	}

	p.z += u_dome * dome(uv);

	if (u_V > 0.0001) {
		float q = (u_center.y + p.y) / u_H;
		p.z -= u_sag * u_V * u_res.y * dome(uv);
		float a = u_twist * u_V * smoothstep(0.3, 0.9, abs(q)) * sign(q);
		float s = sin(a), c = cos(a);
		p.xz = vec2(p.x * c - p.z * s, p.x * s + p.z * c);
		p.z += u_rear * u_H * u_V * smoothstep(-0.2, 1.0, q);
	}
	return p;
}

void main() {
	vUv = uv;
	float th, t1, t2;
	vec3 p = deform(uv, th);
	vec2 e = vec2(0.5 / 48.0, 0.5 / 48.0);
	vec3 px = deform(uv + vec2(e.x, 0.0), t1) - p;
	vec3 py = deform(uv + vec2(0.0, e.y), t2) - p;
	vN = normalize(cross(px, py));
	vZ = p.z;
	vAlpha = 1.0 - smoothstep(0.62 * PI, 0.92 * PI, th);
	gl_Position = projectionMatrix * viewMatrix * vec4(u_center + p.xy, p.z, 1.0);
}
`,f=`
uniform sampler2D u_texture;
uniform vec2 u_size;      // texture px
uniform vec2 u_box;       // the <img> box, px (object-fit: cover inside it)
uniform vec4 u_uv;        // plane uv → box uv: xy offset, zw scale
uniform vec4 u_clip;      // device px, gl_FragCoord space: x0, y0, x1, y1
uniform float u_alpha;    // the element's own opacity (a figure fading inside the sheet)
uniform float u_fade;     // the page's fade (a pull, a push, a leaving page): drawn as a mix toward the backdrop,
uniform vec3 u_bg;        //   opaque — one layer with the DOM sheet fading over the same backdrop (planes.ts chainAlpha)
uniform float u_H;

uniform vec3 u_lightDir;
uniform float u_lit;      // relief light (rel = n\xb7L − L.z)
uniform float u_gloss;
uniform float u_spec;
uniform vec3 u_specTint;
uniform float u_shade;    // depth shade toward black for parts that fall back

varying vec2 vUv;
varying vec3 vN;
varying float vZ;
varying float vAlpha;

vec2 cover(vec2 box, vec2 img, vec2 uv) {
	float br = box.x / box.y, ir = img.x / img.y;
	vec2 s = br < ir ? vec2(br / ir, 1.0) : vec2(1.0, ir / br);
	return uv * s + (1.0 - s) * 0.5;
}

void main() {
	if (gl_FragCoord.x < u_clip.x || gl_FragCoord.y < u_clip.y || gl_FragCoord.x > u_clip.z || gl_FragCoord.y > u_clip.w) discard;
	vec2 b = u_uv.xy + vUv * u_uv.zw;
	vec4 tex = texture2D(u_texture, cover(u_box, u_size, clamp(b, 0.0, 1.0)));
	vec3 col = tex.rgb;

	vec3 n = normalize(gl_FrontFacing ? vN : -vN);
	float back = gl_FrontFacing ? 0.0 : 1.0;
	float rel = dot(n, u_lightDir) - u_lightDir.z;
	col *= 1.0 + u_lit * min(rel, 0.0);
	col += (1.0 - col) * u_lit * max(rel, 0.0) * u_specTint;
	vec3 h = normalize(u_lightDir + vec3(0.0, 0.0, 1.0));
	float h0 = pow(max(h.z, 0.0), u_gloss);
	col += max(pow(max(dot(n, h), 0.0), u_gloss) - h0, 0.0) * u_spec * u_specTint;

	float sink = clamp(-vZ / (0.14 * u_H), 0.0, 1.0);
	col = mix(col, vec3(0.0), u_shade * sink * sink + back * 0.35);

	gl_FragColor = vec4(mix(u_bg, col, u_fade), u_alpha * vAlpha);
}
`,p=[["void main() {",`
uniform float u_cond;     // the morph's progress 0 → 1 (the scroll position; eased here)
uniform float u_seed;
uniform float u_time;
uniform float u_asp;      // plane width / height
uniform sampler2D u_video; // the hero's clip, crossfaded in over its thumbnail (D20)
uniform vec2 u_vsize;     // its px
uniform float u_vid;      // the crossfade, 0 … 1
${c.K}
// the image blurred by ~px box px: a ring of taps on the mip level that size (mips are on for the case-study images)
vec3 blurTex(vec2 bb, float px) {
	float tpp = max(u_size.x / u_box.x, u_size.y / u_box.y);          // texture px per box px (cover)
	float lod = max(0., log2(max(1., px * tpp)) - 1.);
	vec2 r = px * .6 / u_box;
	vec3 s = textureLod(u_texture, cover(u_box, u_size, clamp(bb, 0., 1.)), lod).rgb * 2.;
	for (int i = 0; i < 8; i++) {
		float a = float(i) * .7854 + .39;
		s += textureLod(u_texture, cover(u_box, u_size, clamp(bb + vec2(cos(a), sin(a)) * r, 0., 1.)), lod).rgb;
	}
	return s / 10.;
}

void main() {`],[`	vec4 tex = texture2D(u_texture, cover(u_box, u_size, clamp(b, 0.0, 1.0)));
	vec3 col = tex.rgb;
`,`
	float morphA = 1.;
	vec3 col;
	if (u_cond < 1.) {
		float e = 1. - (1. - u_cond) * (1. - u_cond);
		float sg = pow(1. - e, 1.6);                                   // the heading's blur, 1 → 0
		float ss = pow(1. - e, .55);                                    // the shape's own, slower: the blobs linger
		// the liquid warp: a slow, noisy displacement of the plane (the blobs' edges and the image inside them
		// flow), strong while the shape is blobby, gone at rest
		vec2 q = vec2(vUv.x * u_asp, vUv.y) * 1.7 + u_seed * 3.1;
		vec2 wv = vec2(fbm(q + vec2(u_time * .09, 0.)), fbm(q + vec2(5.2, -u_time * .08))) - .5;
		vec2 uvW = vUv + wv * .28 * ss * vec2(1. / max(u_asp, .01), 1.);
		vec2 bW = u_uv.xy + uvW * u_uv.zw;
		float blurPx = sg * .2 * min(u_box.x, u_box.y);
		vec3 bl = blurPx > .75 ? blurTex(bW, blurPx) : texture2D(u_texture, cover(u_box, u_size, clamp(bW, 0.0, 1.0))).rgb;
		// the field: a soft box (its edge softness falls with the blur) \xd7 the blurred image + a noise, warped
		vec2 hp = min(uvW, 1. - uvW) * vec2(u_asp, 1.);                // distance to the edges, plane heights
		float soft = ss * .12 * min(u_asp, 1.) + 1e-4;                // gooey corners only (the rows carry the blobs)
		float R = smoothstep(0., soft, hp.x) * smoothstep(0., soft, hp.y);
		float lum = dot(bl, vec3(.299, .587, .114));
		float n = fbm(vec2(uvW.x * u_asp, uvW.y) * 5. + u_seed * 7. + vec2(u_time * .11, -u_time * .07));
		float F = R * mix(1., .25 + .4 * lum + .65 * n, min(1., ss * 1.4));
		float th = .5 + .43 * ss;                                      // high at first: only the peaks
		float aa = max(fwidth(F), .002);
		morphA = smoothstep(th - aa, th + aa, F);
		col = mix(bl, vec3(1., 0., 0.), smoothstep(.12, .34, ss));     // red until the blobs have merged
	} else {
		col = texture2D(u_texture, cover(u_box, u_size, clamp(b, 0.0, 1.0))).rgb;
		if (u_vid > 0.) col = mix(col, texture2D(u_video, cover(u_box, u_vsize, clamp(b, 0.0, 1.0))).rgb, u_vid);
	}
`],["gl_FragColor = vec4(mix(u_bg, col, u_fade), u_alpha * vAlpha);","gl_FragColor = vec4(mix(u_bg, col, u_fade), u_alpha * vAlpha * morphA);"]].reduce((e,[t,a])=>(function(e,t,a){if(!e.includes(t))throw Error(`fabric-liquid: shader line not found: ${t}`);return e.replace(t,a)})(e,t,a),f),m=(e,t,a)=>{let o=(0,s.O)((a-e)/(t-e),0,1);return o*o*(3-2*o)},_=0;e.s(["createFabricFx",0,function(e){let{gsap:c,overlay:f}=e;if(e.reduced)return n.j;let g=document.createElement("canvas"),x=g.getContext("webgl2",{alpha:d.W.alpha,depth:!0,stencil:!1,antialias:d.W.antialias,premultipliedAlpha:!0,preserveDrawingBuffer:!1,powerPreference:d.W.powerPreference,failIfMajorPerformanceCaveat:!1});if(!x)return n.j;_++;let b=e.scroller.querySelector(".ov-content");document.documentElement.classList.add("pjfx-fabric");let w=new t.f({canvas:g,context:x,...d.W});w.setPixelRatio(Math.min(r.Z,devicePixelRatio||1)),w.setSize(innerWidth,innerHeight,!1),w.outputColorSpace=a.Rg,w.setClearAlpha(0),g.className="pjfx-gl",g.setAttribute("aria-hidden","true"),f.insertBefore(g,f.querySelector(":scope > .ov-bar"));let y=new a.zm(r.V.fov,innerWidth/innerHeight,r.V.near,r.V.far);y.position.z=r.V.z;let T=new a.P6,z=innerWidth,M=innerHeight,E=()=>Math.tan(y.fov*Math.PI/360)*y.position.z,R=E(),L=0,W=0,S=!0,C=0,k=!1,q={frames:0,renders:0,skipped:0,planes:0},P=new AbortController;addEventListener("resize",function(){z=innerWidth,M=innerHeight,y.aspect=z/M,y.updateProjectionMatrix(),w.setPixelRatio(Math.min(r.Z,devicePixelRatio||1)),w.setSize(z,M,!1),R=E(),S=!0},{signal:P.signal});let{light:D}=e,A=(0,o.M)(D.tintColor).map(e=>1+(e-1)*D.warmth),F=(0,i.f)(getComputedStyle(document.documentElement).getPropertyValue(d.v)),O={u_lightDir:{value:new a.cE(D.lightX,D.lightY,D.lightZ).normalize()},u_specTint:{value:new a.cE(...A)},u_gloss:{value:D.GLOSS},u_spec:{value:D.SPEC},u_lit:{value:d.T.LIT},u_shade:{value:d.T.SHADE},u_H:{value:R},u_camZ:{value:y.position.z},u_bg:{value:new a.cE(F[0]/255,F[1]/255,F[2]/255)},u_V:{value:0},u_twist:{value:d.T.TWIST},u_rear:{value:d.T.REAR},u_sag:{value:d.T.SAG}},V=new a.CQ(1,1,d.E.x,d.E.y),N=function(e){let t=new Map,o=[],l=new WeakMap,i=Math.min(r.n,e.capabilities.getMaxAnisotropy());function u(e,t){return e.colorSpace=a.Ik,e.wrapS=e.wrapT=a.Jr,e.magFilter=a.VV,e.minFilter=t?a.Q4:a.VV,e.generateMipmaps=t,e.anisotropy=i,e.needsUpdate=!0,e}return{image(e){let l=e.currentSrc||e.src;if(!l)return null;let i=t.get(l);if(!i){let r={src:l,tex:null,refs:0,ready:!1,w:1,h:1};t.set(l,r);let n=e=>{t.get(l)===r&&(r.w=e.naturalWidth||1,r.h=e.naturalHeight||1,r.tex=u(new a.Sj(e),!0),o.push(r))},s="anonymous"===e.crossOrigin||(e=>{try{return new URL(e,location.href).origin===location.origin}catch{return!1}})(l),d=s?e:Object.assign(new Image,{crossOrigin:"anonymous",decoding:"async"});s||(d.src=l);let v=()=>d.decode().then(()=>n(d),()=>n(d));d.complete&&d.naturalWidth?v():d.addEventListener("load",()=>void v(),{once:!0}),i=r}return i.refs++,i},release(e){!e||--e.refs>0||setTimeout(()=>{e.refs>0||t.get(e.src)!==e||(e.tex?.dispose(),t.delete(e.src))},d.X)},video(e){let t=l.get(e);return t||l.set(e,t=u(new a.TS(e),!1)),t},uploadOne(){let t=o.shift();return!!t?.tex&&(e.initTexture(t.tex),t.ready=!0,!0)},dispose(){for(let e of t.values())e.tex?.dispose();t.clear(),o.length=0}}}(w),j=(e,t,o,l)=>{var i;let r,u;return i={scene:T,geometry:V,shared:O,vert:h,frag:p,textures:N},r={u_texture:{value:null},u_size:{value:new a.wq(1,1)},u_box:{value:new a.wq(1,1)},u_uv:{value:new a.$h(0,0,1,1)},u_clip:{value:new a.$h(0,0,1e5,1e5)},u_center:{value:new a.wq},u_res:{value:new a.wq(1,1)},u_alpha:{value:1},u_fade:{value:1},u_roll:{value:1},u_rollR:{value:1},u_wind:{value:0},u_dome:{value:0},u_hover:{value:0},u_mouse:{value:new a.wq(.5,.5)},u_dent:{value:0},u_dentR:{value:d.T.DENT_R},u_dentE:{value:d.T.DENT_E},u_cond:{value:1},u_seed:{value:10*Math.random()},u_time:{value:0},u_asp:{value:1},u_video:{value:null},u_vsize:{value:new a.wq(1,1)},u_vid:{value:0}},(u=new a.kE(i.geometry,new a.Zg({vertexShader:i.vert,fragmentShader:i.frag,uniforms:{...i.shared,...r},transparent:!0,depthTest:!1,depthWrite:!1,side:a.Vs}))).frustumCulled=!1,u.visible=!1,i.scene.add(u),{kind:e,fig:t,frame:o,img:l,marked:"teaser"===e?l:t,trio:t.closest(".pj-st-trio"),mesh:u,U:r,entry:i.textures.image(l),hv:{v:0},wind:0,windT:null,handing:!1,dome:0,fold:0,cond:1,shown:!1}},I=new Map,U={down:0,up:0},H=0,B=null;function Z(e){let t=I.get(e);if(t){for(let e of t.planes){var a;(a={scene:T,gsap:c,textures:N}).scene.remove(e.mesh),e.mesh.material.dispose(),a.textures.release(e.entry),a.gsap.killTweensOf([e,e.hv]),e.windT?.kill(),e.marked.classList.remove("fx-gl")}t.heads.forEach(v.p),I.delete(e),B&&(B.from===e||B.to===e)&&(B=null),S=!0}}let Q=()=>{let t=e.live()?.el;return t&&I.get(t)||([...I.values()].find(e=>!e.leaving)??null)},X=null;f.addEventListener("pointermove",e=>{X="touch"===e.pointerType?null:{x:e.clientX,y:e.clientY},S=!0},{passive:!0,signal:P.signal}),f.addEventListener("pointerleave",()=>{X=null,S=!0},{signal:P.signal});let $=null,K=(0,l.f)("fabric",function(t){q.frames++;let a=W?Math.min(r.B,(t-W)*60):1;if(W=t,f.hidden||!I.size){if(k){for(let e of I.values())for(let t of e.planes)t.mesh.visible=!1;w.render(T,y),k=!1}return}N.uploadOne()&&(S=!0);let o=e.scroll(),l=Math.tanh((o?o.target-o.animated:0)/d.T.VEL_NORM);(L+=(Math.min(1,l*l)-L)*(1-Math.pow(1-d.T.V_SMOOTH,a)))<r.o&&(L=0),O.u_V.value=L,O.u_H.value=R;let i=Math.round(1e4*L)+7*z+13*M,u=e=>{i=Math.imul(i,31)+Math.round(16*e)|0},n=2*R/M,h=w.getPixelRatio(),p=Q();if(p?.teaser){let e=d.T.TEASER_WIND*(1-Math.pow(1-U.down,2));p.teaser.wind=e,e>.001&&(H=e)}p?.hero&&!p.hero.handing&&(p.hero.wind=d.T.PULL_WIND*U.up);let _=null,g=0,x=B&&I.get(B.to)?.wrap.getBoundingClientRect();for(let e of I.values()){for(let t of e.heads)(0,v.S)(t,c,M,b);let o=e.wrap.getBoundingClientRect(),l=Math.max(0,o.left-d.T.CLIP_PAD),i=Math.max(0,o.top-d.T.CLIP_PAD),r=Math.min(z,o.right+d.T.CLIP_PAD),f=Math.min(M,o.bottom);for(let o of(e.leaving&&B&&x&&("above"===B.dir?i=Math.max(i,x.bottom):f=Math.min(f,x.top)),e.planes)){let v=o.mesh;if("hero"===o.kind&&!o.fig.classList.contains("is-live")){v.visible=!1,o.shown&&(o.shown=!1,o.marked.classList.remove("fx-gl"));continue}let c=function(e,t){let a=Math.floor(e.left*t)/t,o=Math.floor(e.top*t)/t,l=Math.ceil(e.right*t)/t,i=Math.ceil(e.bottom*t)/t;return{left:a,top:o,right:l,bottom:i,width:l-a,height:i-o}}(o.frame.getBoundingClientRect(),h);if(!c.width||!c.height||c.bottom<-(.25*M)||c.top>1.25*M){v.visible=!1;continue}let p=null,x=1,w=1,y=0;if("hero"===o.kind){let e=o.fig.querySelector("video");if(e&&e.readyState>=2&&"hidden"!==e.style.visibility){let t=parseFloat(e.style.getPropertyValue("--pj-vid")),a=e.videoWidth||1280,l=e.videoHeight||720;u(60*e.currentTime),t<1&&o.entry?.ready?(y=Math.max(0,t),o.U.u_video.value=N.video(e),o.U.u_vsize.value.set(a,l),u(1e3*y)):(p=N.video(e),x=a,w=l)}}o.U.u_vid.value=y,!p&&(o.entry&&(o.img.currentSrc||o.img.src)!==o.entry.src&&(N.release(o.entry),o.entry=N.image(o.img)),o.entry?.ready&&(p=o.entry.tex,x=o.entry.w,w=o.entry.h));let T=(0,s.W)(o.img,b),E=Math.min(function(e){if(!e||"none"===e)return 1;let t=/inset\(\s*([\d.]+)%/.exec(e);return t?1-(0,s.O)(Number(t[1])/100,0,1):1}(o.fig.style.clipPath),1-o.fold);if("fig"===o.kind){let e=o.fig.getBoundingClientRect();o.cond=(0,s.O)((M-e.top)/Math.max(1,Math.min(e.height*d.c.share,M*d.c.screen)),0,1),E=1-o.fold,o.cond>0&&o.cond<1&&(S=!0),p||o.marked.classList.toggle("fx-gl",o.cond<1)}let R=T.a*m(0,.08,E);if(!p||R<.002||T.fade<.002){v.visible=!1,!p&&o.shown&&(o.shown=!1,o.marked.classList.remove("fx-gl"));continue}let L=o.img.getBoundingClientRect(),W=l,C=r;if(o.trio){let e=o.trio.getBoundingClientRect();W=Math.max(W,e.left),C=Math.min(C,e.right)}v.visible=!0,g++,v.renderOrder=+!e.leaving,o.shown||(o.shown=!0,o.marked.classList.add("fx-gl")),X&&!e.leaving&&E>.98&&o.cond>.98&&R>.5&&X.x>=c.left&&X.x<=c.right&&X.y>=c.top&&X.y<=c.bottom&&X.y>=i&&X.y<=f&&(_=o);let k=o.U.u_mouse.value;if(o.hv.v>5e-4&&X&&o===$){let e=(0,s.O)((X.x-c.left)/c.width,0,1),t=(0,s.O)(1-(X.y-c.top)/c.height,0,1),o=1-Math.pow(1-d.T.DENT_FOLLOW,a);k.x+=(e-k.x)*o,k.y+=(t-k.y)*o}for(let e of(!function(e,t){let{fr:a,ir:o,roll:l}=t,{vw:i,vh:r,kk:u,dpr:n}=t.view,s=e.U;s.u_texture.value=t.tex,s.u_size.value.set(...t.size),s.u_box.value.set(o.width,o.height),s.u_uv.value.set((a.left-o.left)/o.width,1-(a.top-o.top+a.height)/o.height,a.width/o.width,a.height/o.height),s.u_center.value.set((a.left+a.width/2-i/2)*u,(r/2-a.top-a.height/2)*u),s.u_res.value.set(a.width*u,a.height*u),s.u_alpha.value=t.a,s.u_fade.value=t.fade,s.u_roll.value=l,s.u_rollR.value=(d.T.ROLL_MIN+d.T.ROLL_MAX*(1-l))*Math.min(a.height,r)*u,s.u_wind.value=e.wind,s.u_dome.value=e.dome*a.height*u;let v=Math.min(a.height,d.T.DENT_REF);s.u_dent.value=d.T.DENT*v*u,s.u_dentR.value=d.T.DENT_R*v/a.height,s.u_dentE.value=d.T.DENT_E*v/a.height;let[c,h,f,p]=t.clip;s.u_clip.value.set(c*n,(r-p)*n,f*n,(r-h)*n),s.u_hover.value=e.hv.v,s.u_cond.value=e.cond,s.u_time.value=t.time,s.u_asp.value=a.width/a.height}(o,{tex:p,size:[x,w],fr:c,ir:L,a:R,fade:T.fade,roll:E,clip:[W,i,C,f],view:{vw:z,vh:M,kk:n,dpr:h},time:t}),[c.left,c.top,c.width,c.height,L.top,L.height,L.left]))u(e);for(let e of[100*R,1e3*T.fade,200*E,1e3*o.cond,1e3*o.wind])u(e);for(let e of[1e3*o.dome,1e3*o.hv.v,1e3*k.x,1e3*k.y,i,f])u(e)}}(!function(e){if(e!==$&&($&&c.to($.hv,{v:0,...r.d,overwrite:!0}),$=e,e)){if(e.hv.v<.05&&X){let t=e.frame.getBoundingClientRect();e.U.u_mouse.value.set((0,s.O)((X.x-t.left)/t.width,0,1),(0,s.O)(1-(X.y-t.top)/t.height,0,1))}c.to(e.hv,{v:1,...r.d,overwrite:!0})}}(_),q.planes=g,S||i!==C)?(S=!1,C=i,w.render(T,y),k=g>0,q.renders++):q.skipped++});return{mount(e){!function(e){let t=e.querySelector(".pj-wrap");if(I.has(e)||!t)return;let a=[],o=e.querySelector(".pj__fig--hero"),l=o?.querySelector("img");for(let t of(o&&l&&a.push(j("hero",o,o,l)),e.querySelectorAll(".pj__fig--extra"))){let e=t.querySelector("img");e&&a.push(j("fig",t,t.querySelector(".pj__frame")??t,e))}let i=e.querySelector(".pj-teaser__img"),r=i?.closest(".pj-teaser__card");i&&r&&a.push(j("teaser",r,i,i)),I.set(e,{el:e,wrap:t,planes:a,heads:[...e.querySelectorAll(v.B)].map(e=>(0,v.F)(e,c)),hero:a.find(e=>"hero"===e.kind)??null,teaser:a.find(e=>"teaser"===e.kind)??null,leaving:!1}),U.down=0,U.up=0,S=!0}(e)},unmount(e){Z(e)},scroll(){S=!0},edge({dir:e,p:t}){let a=(0,s.O)(Number(t)||0,0,1);a!==U[e]&&(U[e]=a,S=!0)},reveal(){},open(){S=!0},close({tl:e}){let t=Q();if(t){for(let a of t.planes)"hero"!==a.kind&&e.add(c.to(a,{fold:1,...d.n}),0);S=!0}},handoff({from:e,to:t,fromEl:a,tl:o}){!function(e,t,a,o){let l=I.get(t);if(!l)return;let i=I.get(e);i&&(i.leaving=!0),B={from:e,to:t,dir:a};let r="teaser"===a?H||d.T.TEASER_WIND:"above"===a?d.T.ABOVE_WIND:d.T.BELOW_WIND;U.down=0,U.up=0;let n=l.hero;if(n){let e={e:0};n.wind=r,n.handing=!0,n.windT?.kill(),n.windT=c.to(e,{e:1,duration:u.r.handoff.duration,ease:u.r.handoff.ease,onUpdate(){n.wind=r*(1-Math.pow(e.e,d.T.FLAT_POW)),n.dome=4*d.T.FLY_LIFT*e.e*(1-e.e)},onComplete(){n.wind=0,n.dome=0,n.handing=!1,B?.to===t&&(B=null)}}),o.add(n.windT,0)}H=0,S=!0}(a,t,e,o)},destroy(){for(let e of(K(),P.abort(),[...I.keys()]))Z(e);N.dispose(),V.dispose(),w.dispose(),g.remove(),document.documentElement.classList.remove("pjfx-fabric"),_--}}}],27799)}]);