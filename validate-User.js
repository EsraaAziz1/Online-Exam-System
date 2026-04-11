let txt = document.querySelector('.txt');
let btn = document.querySelector('.btn');


btn.addEventListener("click" , ()=>{
let txt_value = txt.value.trim();
     if(txt_value.length < 3 || txt_value.length >40 || txt_value ===''){
            console.log(txt_value)
            console.log(txt_value.length)
             alert('Please Enter Valid Name')       
      }
      else{
        localStorage.setItem('User_Name' , JSON.stringify(txt_value));
        window.location='start-Exam.html';
      }
})