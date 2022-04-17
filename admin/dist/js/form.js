var base_url = "http://127.0.0.1:5000/users/";

function addUser() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var contact = document.getElementById('contact').value;
    var password = document.getElementById('password').value;
    var c_password = document.getElementById('c_password').value;

    if(valName(name)){
        if(valEmail(email)){
            if(valTelephone(contact)){
                if(valPass(password, c_password)){
                    var data = {
                        "Name": name,
                        "Email": email,
                        "Contact": contact,
                        "Password": password
                    }

                    $.ajax({
                    url:base_url+"signup",
                    type:'POST',
                    contentType: "application/json",
                    data:JSON.stringify(data),
                    success:function(response){
                        window.location.replace("activationLink.html");
                    },
                    })
                }
            }
        }
    }
}


function signin() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    if(valEmail(email)){
            var data = {
                "Email": email,
                "Password": password
            }

            $.ajax({
            url:base_url+"signin",
            type:'POST',
            contentType: "application/json",
            data:JSON.stringify(data),
            success:function(response){
                console.log(response);
                "token" in response ? 
                        localStorage.setItem('token', response.token):
                        localStorage.setItem('token', '');
                "token" in response ? 
                        window.location.replace("index.html") :
                        swal({
                            title: response.msg,
                            animation: false
                            });
            },
        })
    }
}

function forgetPassword() {
    var email = document.getElementById('email').value;
    
    if(valEmail(email)){
            var data = {
                "Email": email,
            }

            $.ajax({
            url:base_url+"forgotpassword",
            type:'POST',
            contentType: "application/json",
            data:JSON.stringify(data),
            success:function(response){
                window.location.replace("forgotPasswordLink.html");
            },
        })
    }
}

function resetPassword() {
    var password = document.getElementById('password').value;
    var c_password = document.getElementById('c_password').value;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
    if(valPass(password, c_password)){
            var data = {
                "Password": password,
                "token": token
            }

            $.ajax({
            url:base_url+"resetpassword",
            type:'POST',
            contentType: "application/json",
            data:JSON.stringify(data),
            success:function(response){
                swal({
                    title: "Password reset successfully. You will be redirected to login page in 3 seconds.",
                    animation: false
                    });
                setTimeout(function() {
                    window.location.replace("login.html");
                }, 3000)
                
            },
        })
    }
}



function heartTest() {
    const token = localStorage.getItem('token');
    var age = document.getElementById('age').value;
    var sex = document.getElementById('sex').value;
    var cp = document.getElementById('cp').value;
    var trestbps = document.getElementById('trestbps').value;
    var chol = document.getElementById('chol').value;
    var fbs = document.getElementById('fbs').value;
    var restecg = document.getElementById('restecg').value;
    var thalach = document.getElementById('thalach').value;
    var exang = document.getElementById('exang').value;
    var oldpeak = document.getElementById('oldpeak').value;
    var slope = document.getElementById('slope').value;
    var ca = document.getElementById('ca').value;
    var thal = document.getElementById('thal').value;
    var data = {
        "age": age,
        "sex": sex,
        "cp": cp,
        "trestbps": trestbps,
        "chol": chol,
        "fbs": fbs,
        "restecg": restecg,
        "thalach": thalach,
        "exang": exang,
        "oldpeak": oldpeak,
        "slope": slope,
        "ca": ca,
        "thal": thal, 
        "token": token 
    }
    $.ajax({
        url:base_url+"hearttest",
        type:'POST',
        contentType: "application/json",
        data:JSON.stringify(data),
        success:function(response){
            swal({
                title: response.msg,
                animation: false
                });
            setTimeout(function() {
                window.location.reload();
            }, 2000)
                
        },
    })
}



$( document ).ready(function() {
    const token = localStorage.getItem('token');
    var data = {
        "token": token
    }
    $.ajax({
        url:base_url+"fetchrecords",
        type:'POST',
        data:JSON.stringify(data),
        contentType: "application/json",
        success:function(response){
            console.log(response);
            var tr = '';
            response.records.forEach((item, index)=>{
                var gender = item.age == 1? "Male":"Female";
                var cp = '';
                if(item.cp == 0){
                    cp = "Typical Angina";
                }else if(item.cp == 1){
                    cp = "Atypical Angina";
                }else if(item.cp == 2) {
                    cp = "Non-Aginal pain";
                }else{
                    cp = "Asymptomatic";
                }
                var sugar = item.fbs == 1? "GT 120" : "LT 120";
                var ecg = '';
                if(item.restecg == 0){
                    ecg = "Normal";
                }else if(item.restecg == 1){
                    ecg = "ST-T wave";
                }else if(item.restecg == 2) {
                    ecg = "Left ventricular hypertrophy";
                }

                var slope = '';
                if(item.slope == 0){
                    slope = "Upsloping";
                }else if(item.slope == 1){
                    slope = "Flat";
                }else if(item.slope == 2) {
                    slope = "Downsloping";
                }

                var thal = '';
                if(item.thal == 3){
                    thal = "Normal";
                }else if(item.thal == 6){
                    thal = "Fixed defect";
                }else if(item.thal == 7) {
                    thal = "Reversible defect";
                }

                var target = item.target == 1? "No" : "Yes";

                var exang = item.exang == 1? "Yes":"No";
                tr += `<tr>
                            <td>${index+1}</td>
                            <td>${item.age}</td>
                            <td>${gender}</td>
                            <td>${cp}</td>
                            <td>${item.trestbps}</td>
                            <td>${item.chol}</td>
                            <td>${sugar}</td>
                            <td>${ecg}</td>
                            <td>${item.thalach}</td>
                            <td>${exang}</td>
                            <td>${item.oldpeak}</td>
                            <td>${slope}</td>
                            <td>${item.ca}</td>
                            <td>${thal}</td>
                            <td>${target}</td>
                        </tr>`;
            });
           document.getElementById('recordTable').innerHTML = tr;
        },
    })
});


function logout() {
    localStorage.removeItem('token');
    window.location.replace("login.html");
}



// Validation functions

//function to validate user's name
function valName(val) {
    if (val == '') {
        swal({
            title: "Enter user" + "'s" + " name",
            animation: false
          });
        return false; 
    } else {
        return true;
    }
}

//function to validate user's email
function valEmail(val) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (val == '') {
        swal({
            title: "Enter valid user" + "'s" + " email",
            animation: false
          });
        return false;
    } else {
        if (val.match(mailformat)) {
            return true;
        } else {
            swal({
                title: "Enter valid user" + "'s" + " email",
                animation: false
              });
            return false;
        }
    }
}

//function to validate user's password
function valPass(val, c_val) {
    if (val == '') {
        swal({
            title: 'Enter user password',
            animation: false
          });
        return false;
    }else if (c_val == ''){
        swal({
            title: 'Enter confirm password',
            animation: false
          });
        return false;
    }else if (c_val != val){
        swal({
            title: "Password and confirm password doesn't match",
            animation: false
          });
        return false;
    }else {
        return true;
    }
}

//function to validate user's contact
function valTelephone(val) {
    if (val == '' || val.length != 10) {
            swal({
                title: 'Enter valid contact number',
                animation: false
              });
            return false;
    } else {
        return true;
    }
}
