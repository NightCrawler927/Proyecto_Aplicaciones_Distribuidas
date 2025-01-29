from flask import Flask, render_template, request, redirect, url_for, flash
import requests

app = Flask(__name__)
app.secret_key = "secret_key"
BASE_URL = "https://6563frate2.execute-api.us-east-1.amazonaws.com"

@app.route("/")
def index():
    response = requests.get(f"{BASE_URL}/pelicula")
    peliculas = response.json() if response.status_code == 200 else []
    return render_template("index.html", peliculas=peliculas)

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

if __name__ == "__main__":
    app.run(debug=True)