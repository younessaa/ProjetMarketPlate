import React, { Component } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
class Commander extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      // point_relais: "",
      Commande: {},
      Mouton: {},
      eleveur: {},
      checked:false,
      Empty:true,
image:"",

      redirect: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onChangecheck=this.onChangecheck.bind(this);
    this.onClickImageBoucle = this.onClickImageBoucle.bind(this);
    this.onClickImageProfile = this.onClickImageProfile.bind(this);
    this.onClickImageFace = this.onClickImageFace.bind(this);
  }
  onChange(e) {
    
    const token = localStorage.getItem("usertoken");
    // if
    // console.log("tuseroken"+ token)
    let cmd = {
      // localisation: e.target.value,
      point_relais: e.target.value,
      id_mouton: this.props.location.state.id,
      id_eleveur: this.state.eleveur._id,
      id_consommateur: token,
      statut: "en attente de paiement avance",
      reçu_avance: "",
      feedback_avance: "",
      msg_refus_avance: null,
      reçu_montant_restant: null,
      feedback_reçu_montant_restant: null,
      msg_refus_reste: null,
      date_creation: new Date(),
      // .toLocaleString()
    };
    this.setState({
      Commande: cmd,
      Empty:false
    });
  }
  onChangecheck(e){
    if(this.state.checked==true)
    this.setState({checked:false})
    else
    this.setState({checked:true})
  }


  componentDidMount() {
    const idm = this.props.location.state.id;
    axios
      .get("http://127.0.0.1:8000/api/mouton/" + idm, {
        headers: {
          // "x-access-token": token, // the token is a variable which holds the token
        },
      })
      .then((res) => {
        this.setState({
          Mouton: res.data.objet,
          eleveur: res.data.Eleveur[0],
          image:res.data.objet.image_profile
        });
        console.log(res);
      });

    console.log(this.state.Mouton);
  }

  onClickImageBoucle(){
    this.setState({image:this.state.Mouton.image_boucle})
  }
  onClickImageProfile(){
    this.setState({image:this.state.Mouton.image_profile})
  }
  onClickImageFace(){
    this.setState({image:this.state.Mouton.image_face})
  }

  render() {
    return (
      <div>
        <section class="product-details spad">
          <div class="container">
            <div className="row">
              <div class="col-lg-6 col-md-6">
                <div class="product__details__pic">
                  <div class="product__details__pic__item">
                    <img
                      class="product__details__pic__item--large"
                      src={this.state.image}
                      alt=""
                    />
                  </div>
                  {/* <div className="product__details__pic__slider owl-carousel">
                    <img
                      data-imgbigurl="Images/1.jpg"
                      src="Images/1.jpg"
                      alt=""
                    />
                    <img
                      data-imgbigurl="Images/1.jpg"
                      src="Images/1.jpg"
                      alt=""
                    />
                  </div> */}

                  <div className="row">
                    <div className="container">
                      <div className="col-lg-12 col-md-12">
                        <img
                          className="col-lg-4 col-md-4"
                          // data-imgbigurl="Images/1.jpg"
                          src={this.state.Mouton.image_boucle}
                          alt=""
                          onClick={this.onClickImageBoucle}
                        />
                        <img
                          className="col-lg-4 col-md-4"
                          // data-imgbigurl="Images/1.jpg"
                          src={this.state.Mouton.image_face}
                          alt=""
                          onClick={this.onClickImageFace}
                        />
                        <img
                          className="col-lg-4 col-md-4"
                          // data-imgbigurl="Images/1.jpg"
                          src={this.state.Mouton.image_profile}
                          alt=""
                          onClick={this.onClickImageProfile}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div class="checkout__form">
                  <form action="#" onSubmit="" name="commander">
                    <h3>Commander votre mouton</h3> <br></br>
                    <h4>Résumé de vote commande</h4>
                    <div class="col-lg-12 col-md-6">
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Boucle</b>
                            </p>
                            <span>{this.state.Mouton.boucle}</span>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Race</b>
                            </p>
                            <span>{this.state.Mouton.race}</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Poids</b>
                            </p>
                            <span>{this.state.Mouton.poids} Kg</span>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Age</b>
                            </p>
                            <span>{this.state.Mouton.age} mois</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Avance</b>
                            </p>
                            <span>{this.state.Mouton.avance} MAD</span>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Prix mouton</b>
                            </p>
                            <span>{this.state.Mouton.prix} MAD</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Eleveur</b>
                            </p>
                            <span>
                              {this.state.eleveur.nom +
                                "   " +
                                this.state.eleveur.prenom}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4>Détails livraison</h4>
                    <div class="col-lg-12 col-md-6">
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <b>
                              Votre ville de livraison<span>*</span>
                            </b>
                            <input
                              type="text"
                              name="point_relais"
                              onChange={this.onChange}
                              required
                            />
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Le point de relais</b>
                            </p>
                            <span>Rue 233 Hassan II Oujda</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-6">
                          <div class="checkout__input">
                            <p>
                              <b>Date de livraison</b>
                            </p>
                            <span>La veille de l'Aid</span>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="checkout__input bg-ligh text-danger h6 center">
                            <p>
                              <b>Heure de livraison</b>
                            </p>
                            <span>
                              Un agent ANOC va vous appeler pour vous informer
                              de l'heure exacte de livraison au point de relais
                              spécifié en haut
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4>Détails paiement</h4>
                    <div class="checkout__input bg-ligh text-danger h6 center">
                      <p>
                        <b>Mode de paiement</b>
                      </p>
                      <span>
                        <b>Virement bancaire</b>
                      </span>
                    </div>
                    <h6>
                      Vous devez accepter{" "}
                      <a href="./Regles">
                        <b>
                          <u>les conditions générales de vente et achat</u>
                        </b>
                      </a>{" "}
                      pour continuer.
                    </h6>
                    <br></br>
                    <div class="checkout__input__checkbox">
                      <label for="regles">
                        J'accepte les conditions générales des règles de vente
                        et achat
                        <input type="checkbox" id="regles" required onChange={this.onChangecheck}/>
                        <span class="checkmark"></span>
                      </label>
                    </div>
                    <h4>Détails du prix</h4>
                    <div class="shoping__checkout">
                      <ul>
                        <li>
                          Avance <span>{this.state.Mouton.avance} MAD</span>
                        </li>
                        <li>
                          Prix Transport <span>60 MAD</span>
                        </li>
                        <li>
                          Prix Total{" "}
                          <span>{parseInt(this.state.Mouton.prix)+60 } MAD</span>
                        </li>
                        <li>
                          <a href="/ToutesLesAnnonces" class="primary-btn">
                            Annuler commande
                          </a>{" "}
                          <br></br>
                          {(this.state.checked && !this.state.Empty)? (    <Link
                            to={{
                              pathname: "/AlerteCommande",
                              state: {
                                id: this.state.Commande,
                              },
                            }}
                          >
                            {" "}
                            <a href="#" class="primary-btn" disabled>
                              Valider
                            </a>{" "}
                          </Link>):null}
                        </li>
                      </ul>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Commander;