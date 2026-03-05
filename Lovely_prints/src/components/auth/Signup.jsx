import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Building2, Lock, Eye, EyeOff } from "lucide-react";
import "./signup.css";

const LOGO = "/src/assets/logo.png";
const EXPO = [0.16, 1, 0.3, 1];

const PERKS = [
  { icon: "🎓", text: "Student-only access — campus verified" },
  { icon: "📁", text: "Upload PDF, DOCX, PPT — any format" },
  { icon: "💳", text: "Secure in-app payments, no cash needed" },
];

function FloatingBlob({ style, delay = 0 }) {
  return (
    <motion.div
      className="su-blob_z"
      style={style}
      animate={{ y: [0, -14, 0], x: [0, 8, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function Signup() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [organisation,setOrganisation] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");

  const [showPass,setShowPass] = useState(false);
  const [showConfirm,setShowConfirm] = useState(false);

  const [focusedField,setFocusedField] = useState(null);
  const [error,setError] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();

    if(!name || !email || !organisation || !password || !confirm){
      setError("Please fill in all fields.");
      return;
    }

    if(password.length < 8){
      setError("Password must be at least 8 characters.");
      return;
    }

    if(password !== confirm){
      setError("Passwords do not match.");
      return;
    }

    setError("");

    console.log({
      name,
      email,
      organisation,
      password
    });
  };

  return (
    <div className="su-root_z">

      {/* LEFT PANEL */}
      <div className="su-left_z">

        <div className="su-left-grid_z" />

        <FloatingBlob
          style={{
            width:340,
            height:340,
            top:"-80px",
            right:"-80px",
            background:"radial-gradient(circle, rgba(254,195,69,0.22) 0%, transparent 70%)"
          }}
        />

        <FloatingBlob
          style={{
            width:260,
            height:260,
            bottom:"60px",
            left:"-60px",
            background:"radial-gradient(circle, rgba(139,175,41,0.2) 0%, transparent 70%)"
          }}
          delay={2}
        />

        <FloatingBlob
          style={{
            width:180,
            height:180,
            top:"38%",
            right:"12%",
            background:"radial-gradient(circle, rgba(186,205,237,0.24) 0%, transparent 70%)"
          }}
          delay={1}
        />

        <div className="su-left-inner_z">

          <motion.a
            href="/"
            className="su-brand_z"
            initial={{opacity:0,y:-16}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.6,ease:EXPO}}
          >
            <img src={LOGO} alt="KaagaZ" className="su-logo_z"/>
            <span className="su-brand-name_z">KaagaZ</span>
          </motion.a>

          <motion.div
            className="su-left-pill_z"
            initial={{opacity:0,x:-20}}
            animate={{opacity:1,x:0}}
            transition={{duration:0.6,delay:0.15,ease:EXPO}}
          >
            <span className="su-pill-dot_z"/>
            Student Registration
          </motion.div>

          <motion.h1
            className="su-left-h1_z"
            initial={{opacity:0,y:36}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.75,delay:0.25,ease:EXPO}}
          >
            Your campus,<br/>
            <span className="su-h1-gold_z">your prints.</span><br/>
            <span className="su-h1-outline_z">Your way.</span>
          </motion.h1>

          <motion.p
            className="su-left-sub_z"
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.7,delay:0.38,ease:EXPO}}
          >
            Join thousands of students who skip the queue and get their documents printed on their schedule.
          </motion.p>

          <motion.div
            className="su-features_z"
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.7,delay:0.5,ease:EXPO}}
          >
            {PERKS.map((f,i)=>(
              <motion.div
                key={f.text}
                className="su-feat-row_z"
                initial={{opacity:0,x:-16}}
                animate={{opacity:1,x:0}}
                transition={{duration:0.5,delay:0.55+i*0.1,ease:EXPO}}
              >
                <span className="su-feat-icon_z">{f.icon}</span>
                <span className="su-feat-text_z">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="su-right_z">

        <div className="su-right-bg_z"/>

        <motion.div
          className="su-card_z"
          initial={{opacity:0,y:40,scale:0.96}}
          animate={{opacity:1,y:0,scale:1}}
          transition={{duration:0.8,delay:0.12,ease:EXPO}}
        >

          <div className="su-card-header_z">
            <div className="su-card-title_z">Sign Up</div>
            <div className="su-card-sub_z">Start printing smarter today...</div>
          </div>

          <form className="su-form_z" onSubmit={handleSubmit}>

            {/* NAME */}
            <div className={`su-field_z ${focusedField==="name"?"focused_z":""} ${error && !name ? "error_z" : ""}`}>
              <label className="su-label_z">Full Name</label>
              <div className="su-input-wrap_z">
                <span className="su-input-icon_z"><User size={18}/></span>
                <input
                  className="su-input_z"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  onFocus={()=>setFocusedField("name")}
                  onBlur={()=>setFocusedField(null)}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className={`su-field_z ${focusedField==="email"?"focused_z":""} ${error && !email ? "error_z" : ""}`}>
              <label className="su-label_z">Email address</label>
              <div className="su-input-wrap_z">
                <span className="su-input-icon_z"><Mail size={18}/></span>
                <input
                  className="su-input_z"
                  placeholder="Email address"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  onFocus={()=>setFocusedField("email")}
                  onBlur={()=>setFocusedField(null)}
                />
              </div>
            </div>

            {/* ORGANISATION */}
            <div className={`su-field_z ${focusedField==="organisation"?"focused_z":""} ${error && !organisation ? "error_z" : ""}`}>
              <label className="su-label_z">Organisation</label>
              <div className="su-input-wrap_z">
                <span className="su-input-icon_z"><Building2 size={18}/></span>
                <input
                  className="su-input_z"
                  placeholder="Select organisation"
                  value={organisation}
                  onChange={(e)=>setOrganisation(e.target.value)}
                  onFocus={()=>setFocusedField("organisation")}
                  onBlur={()=>setFocusedField(null)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className={`su-field_z ${focusedField==="password"?"focused_z":""} ${error && !password ? "error_z" : ""}`}>
              <label className="su-label_z">Password</label>
              <div className="su-input-wrap_z">
                <span className="su-input-icon_z"><Lock size={18}/></span>
                <input
                  type={showPass?"text":"password"}
                  className="su-input_z"
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  onFocus={()=>setFocusedField("password")}
                  onBlur={()=>setFocusedField(null)}
                />
                <button type="button" className="su-eye-btn_z" onClick={()=>setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* CONFIRM */}
            <div className={`su-field_z ${focusedField==="confirm"?"focused_z":""} ${error && !confirm ? "error_z" : ""}`}>
              <label className="su-label_z">Confirm Password</label>
              <div className="su-input-wrap_z">
                <span className="su-input-icon_z"><Lock size={18}/></span>
                <input
                  type={showConfirm?"text":"password"}
                  className="su-input_z"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e)=>setConfirm(e.target.value)}
                  onFocus={()=>setFocusedField("confirm")}
                  onBlur={()=>setFocusedField(null)}
                />
                <button type="button" className="su-eye-btn_z" onClick={()=>setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="su-error_z"
                  initial={{opacity:0,y:-8,height:0}}
                  animate={{opacity:1,y:0,height:"auto"}}
                  exit={{opacity:0,y:-8,height:0}}
                  transition={{duration:0.25}}
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="su-btn-primary_z"
              whileHover={{scale:1.02}}
              whileTap={{scale:0.98}}
            >
              Create Account →
            </motion.button>

          </form>

          <div className="su-card-footer_z">
            Already have an account ?{" "}
            <a href="/login" className="su-link_z">Login →</a>
          </div>

        </motion.div>

      </div>

    </div>
  );
}