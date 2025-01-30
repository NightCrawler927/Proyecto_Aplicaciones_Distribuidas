from flask import Flask, render_template, request, redirect, url_for, flash
import requests
from flask import Flask, render_template, request, redirect, url_for, flash, session

app = Flask(__name__)
app.secret_key = "secret_key"
BASE_URL = "https://6563frate2.execute-api.us-east-1.amazonaws.com"


@app.route("/")
def index():
    return redirect(url_for("login"))


# @app.route("/")
# def index():
#     response = requests.get(f"{BASE_URL}/pelicula")
#     peliculas = response.json() if response.status_code == 200 else []
#     return render_template("index.html", peliculas=peliculas)

@app.route("/pelicula/<id>")
def pelicula_detail(id):
    # Obtener los detalles de la película
    response = requests.get(f"{BASE_URL}/pelicula/{id}")
    pelicula = response.json() if response.status_code == 200 else {}
    return render_template("pelicula_detail.html", pelicula=pelicula)

@app.route("/pelicula/nueva", methods=["GET", "POST"])
def agregar_pelicula():
    if request.method == "POST":
        data = {
            "titulo": request.form["titulo"],
            "genero": request.form["genero"],
            "alanzamiento": request.form["alanzamiento"],
            "stockdisponible": request.form["stockdisponible"],
            "precioventa": request.form["precioventa"],
        }
        response = requests.post(f"{BASE_URL}/pelicula", json=data)
        if response.status_code == 200:
            flash("Película agregada con éxito", "success")
            return redirect(url_for("index"))
        flash("Error al agregar película", "danger")
    return render_template("pelicula_form.html")

@app.route("/pelicula/editar/<id>", methods=["GET", "POST"])
def editar_pelicula(id):
    if request.method == "POST":
        data = {
            "titulo": request.form["titulo"],
            "genero": request.form["genero"],
            "alanzamiento": request.form["alanzamiento"],
            "stockdisponible": request.form["stockdisponible"],
            "precioventa": request.form["precioventa"],
        }
        response = requests.put(f"{BASE_URL}/pelicula/{id}", json=data)
        if response.status_code == 200:
            flash("Película actualizada con éxito", "success")
            return redirect(url_for("index"))
        flash("Error al actualizar película", "danger")
    
    response = requests.get(f"{BASE_URL}/pelicula/{id}")
    if response.status_code == 200:
        pelicula_data = response.json().get('book', {})
        return render_template("pelicula_form.html", pelicula=pelicula_data)
    else:
        flash("Error al obtener los datos de la película", "danger")
        return redirect(url_for("index"))

@app.route("/pelicula/eliminar/<id>")
def eliminar_pelicula(id):
    response = requests.delete(f"{BASE_URL}/pelicula/{id}")
    if response.status_code == 200:
        flash("Película eliminada con éxito", "success")
    else:
        flash("Error al eliminar película", "danger")
    return redirect(url_for("index"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        
        # Depuración: Imprime las credenciales enviadas
        print(f"Email: {email}, Password: {password}")
        
        # Enviar solicitud a la API
        response = requests.post(
            f"{BASE_URL}/usuario/login",
            json={"email": email, "password": password}
        )
        
        # Depuración: Imprime la respuesta de la API
        print(f"Status Code: {response.status_code}, Response: {response.json()}")
        
        if response.status_code == 200:
            # Obtener el token de la respuesta
            token = response.json().get("token")
            if token:
                # Guardar el token en la sesión del usuario
                session["token"] = token
                flash("Inicio de sesión exitoso", "success")
                return redirect(url_for("index"))
            else:
                flash("Error: No se recibió un token válido", "danger")
        else:
            flash("Credenciales incorrectas. Intenta de nuevo.", "danger")
    
    return render_template("login.html")



@app.route("/registro", methods=["GET", "POST"])
def registro():
    if request.method == "POST":
        nombreUsuario = request.form["nombreUsuario"]  # Captura el nombre de usuario
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        if password != confirm_password:
            flash("Las contraseñas no coinciden", "danger")
            return render_template("registro.html")
        
        # Depuración: Imprime los datos enviados a la API
        print(f"Nombre de usuario: {nombreUsuario}, Email: {email}, Password: {password}")
        
        # Enviar solicitud de registro a la API
        response = requests.post(
            f"{BASE_URL}/usuario/registrar",
            json={
                "nombreUsuario": nombreUsuario,
                "email": email,
                "password": password  # Asegúrate de que la API espere "password" y no "pass"
            }
        )
        
        # Depuración: Imprime la respuesta de la API
        print(f"Status Code: {response.status_code}, Response: {response.json()}")
        
        if response.status_code == 200:
            flash("Registro exitoso. Puedes iniciar sesión ahora.", "success")
            return redirect(url_for("login"))
        else:
            flash("Error al registrar usuario", "danger")
    
    return render_template("registro.html")


if __name__ == "__main__":
    app.run(debug=True)