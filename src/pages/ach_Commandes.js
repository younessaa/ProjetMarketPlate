import React, { Component } from "react";
import axios from "axios";
import { GiWeight, GiSheep } from 'react-icons/gi';
import Swal from "sweetalert2";
import { CgFileAdd } from 'react-icons/cg'
import Loader from "react-loader-spinner";
import Select from "react-select";

import { Link } from "react-router-dom";
class Commandes extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      Commandes: [],
      CommandesT: [],
      CommandesN: [],
      CommandesR: [],
      nbrEspece: [],
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      annoncesPerPage: 8,
      loading: true,
      redirect: false,
      selectedOptionSort: null,
      optionsSort: [],
      selectedOptionSort1: null,
      optionsSort1: [
        { value: "", label: "Option de filtrage" },

        { value: "delai_avance", label: "Delai de paiement depasse de l'avance" },
        { value: "delai_reste", label: "Delai de paiement depasse du reste " },

        { value: "Reçu de l’avance non conforme", label: "Reçu non conforme de l'avance" },
        { value: "Reçu du reste non conforme", label: "Reçu non conforme du reste" },

        { value: "Montant de l’avance non reçu", label: "Montant non reçu de l'avance" },
        { value: "Montant du reste non reçu", label: "Montant non reçu du reste" },

        { value: "Annulation", label: "Annulation(s) effectuee(s) par moi-meme avant la livraison" },
        { value: "rejet", label: "Annulation(s) effectuee(s) Rejet a la livraison " },
      ],
      selectedOptionSort2: null,
      optionsSort2: [
        { value: "", label: "Option de filtrage" },
        { value: "avance", label: "Avance moins cher au plus cher" },
        { value: "avance_dec", label: "Avance plus cher au moins cher" },

        { value: "deadline", label: "Delai de paiement Plus proche" },
        { value: "deadline_dec", label: "Delai de paiement plus lointaine" },

      ],
      selectedOptionSort3: null,
      optionsSort3: [
        { value: "", label: "Option de filtrage" },
        { value: "reste", label: "Reste moins cher au plus cher" },
        { value: "reste_dec", label: "Reste plus cher au moins cher" },

        { value: "deadline", label: "Delai de paiement Plus proche" },
        { value: "deadline_dec", label: "Delai de paiement plus lointaine" },
      ],
      selectedOptionSort4: null,
      optionsSort4: [
        { value: "", label: "Option de filtrage" },
        { value: "prix_total", label: "Prix Moins cher au plus cher" },
        { value: "prix_total_dec", label: "Prix Plus cher au moins cher" },

        { value: "date_de_livraison", label: "Date de livraison Plus proche" },
        { value: "date_de_livraison_dec", label: "Date de livraison plus lointaine" },

        { value: "en attente de validation reste", label: "Commande(s) en cours de validation" },
        { value: "validé", label: "Commande(s) validee(s)" },
      ],
    };
    this.paginate = this.paginate.bind(this);
    this.sortData = this.sortData.bind(this);
  }

  sortData(e) {
    const sortProperty = Object.values(e)[0];
    const sorted = this.state.CommandesN;
    let sortCmd = sorted;

    if (sortProperty === "Reçu de l’avance non conforme" || sortProperty === "Reçu du reste non conforme"
      || sortProperty === "Montant de l’avance non reçu" || sortProperty === "Montant du reste non reçu") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter((c) => c.msg_refus_avance == sortProperty || c.msg_refus_reste == sortProperty)
        this.setState({
          Commandes: sortCmd,
          loading: false
        });
      });
    }
    else if (sortProperty === "validé" || sortProperty === "en attente de validation reste") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter((c) => c.statut == sortProperty)
        this.setState({
          Commandes: sortCmd,
          loading: false
        });
      });
    }
    else if (sortProperty === "avance" || sortProperty === "reste" || sortProperty === "prix_total") {
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => a[sortProperty] - b[sortProperty]);
        this.setState({
          Commandes: sorted,
          loading: false
        });
      });
    }
    else if (sortProperty === "avance_dec" || sortProperty === "reste_dec" || sortProperty === "prix_total_dec") {
      const sort_ = sortProperty.substr(0, sortProperty.length - 4);
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Commandes: sorted, loading: false });
      });
    }

    else if (sortProperty === "date_de_livraison") {
      this.setState({ loading: true }, () => {
        sorted.sort(
          function (a, b) {
            return new Date(a[sortProperty]) - new Date(b[sortProperty]);
          }); this.setState({
            Commandes: sorted,
            loading: false
          });
      });
    }
    else if (sortProperty === "date_de_livraison_dec") {
      const sort_ = "date_de_livraison";
      this.setState({ loading: true }, () => {
        sorted.sort(
          function (a, b) {
            return new Date(b[sort_]) - new Date(a[sort_]);
          });
        this.setState({ Commandes: sorted, loading: false });
      });
    }

    else if (sortProperty === "deadline") {

      this.setState({ loading: true }, () => {
        sorted.sort(
          function (a, b) {
            return new Date(a[sortProperty].substr(6, 4), a[sortProperty].substr(3, 2), a[sortProperty].substr(0, 2), a[sortProperty].substr(12, 2), a[sortProperty].substr(15, 2), a[sortProperty].substr(18, 2))
              - new Date(b[sortProperty].substr(6, 4), b[sortProperty].substr(3, 2), b[sortProperty].substr(0, 2), b[sortProperty].substr(12, 2), b[sortProperty].substr(15, 2), b[sortProperty].substr(18, 2));
          });
        this.setState({ Commandes: sorted, loading: false });
      });
    }
    else if (sortProperty === "deadline_dec") {
      const sort_ = "deadline";
      this.setState({ loading: true }, () => {
        sorted.sort(
          function (a, b) {
            return new Date(b[sort_].substr(6, 4), b[sort_].substr(3, 2), b[sort_].substr(0, 2), b[sort_].substr(12, 2), b[sort_].substr(15, 2), b[sort_].substr(18, 2))
              - new Date(a[sort_].substr(6, 4), a[sort_].substr(3, 2), a[sort_].substr(0, 2), a[sort_].substr(12, 2), a[sort_].substr(15, 2), a[sort_].substr(18, 2));
          });
        this.setState({ Commandes: sorted, loading: false });
      });
    }
    else if (sortProperty === "rejet") {
      this.setState({ loading: true }, () => {
        this.setState({
          Commandes: this.state.CommandesR,
          loading: false
        });
      });
    }

    else if (sortProperty === "Annulation") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter((c) => c.statut == "annulée manuellement")
        this.setState({
          Commandes: sortCmd,
          loading: false
        });
      });
    }
    else if (sortProperty === "delai_reste") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter((c) => c.reçu_montant_restant == null && c.reçu_avance != null &&
          c.statut == "commande annulée (deadline dépassé)")
        this.setState({
          Commandes: sortCmd,
          loading: false
        });
      });
    }
    else if (sortProperty === "delai_avance") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter((c) => c.reçu_avance == null && c.statut == "commande annulée (deadline dépassé)")
        this.setState({
          Commandes: sortCmd,
          loading: false
        });
      });
    }
    else {
      this.setState({ loading: true }, () => {
        this.setState({
          Commandes: sorted,
          loading: false
        });
      });
    }
  }

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  componentDidMount() {
    const token = localStorage.getItem("usertoken");
    const statut = this.props.location.state.id;
    let statuts = statut.split('#')
    const pageNumbers = [];
    if (this.props.location.state.id.split("#").includes("avarié")) {
      this.setState({ optionsSort: this.state.optionsSort1, selectedOptionSort: this.state.selectedOptionSort1 })
    }
    else if (this.props.location.state.id.split("#").includes("en attente de paiement avance") || this.props.location.state.id.split("#").includes("en attente de validation avance")) {
      this.setState({ optionsSort: this.state.optionsSort2, selectedOptionSort: this.state.selectedOptionSort2 })
    }
    else if (this.props.location.state.id.split("#").includes("en attente de paiement du reste")) {
      this.setState({ optionsSort: this.state.optionsSort3, selectedOptionSort: this.state.selectedOptionSort3 })
    }
    else if (this.props.location.state.id.split("#").includes("validé" || "en attente de validation reste")) {
      this.setState({ optionsSort: this.state.optionsSort4, selectedOptionSort: this.state.selectedOptionSort4 })
    }

    const myToken = `Bearer ` + localStorage.getItem("myToken");
    this.setState({ loading: true }, () => {
      if (!token) {
        this.props.history.push("/login");
      }
      else {
        axios
          .get("http://127.0.0.1:8000/api/commande", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
              "Authorization": myToken,
            },
            params: {
              id_consommateur: token,
              order_by: "date_creation",
              order_mode: "asc",
            },
          })
          .then((res) => {

            this.setState(
              { CommandesT: res.data, },
              () => {

                this.setState((prevState, props) => ({

                  Commandes: [...new Set(this.state.CommandesT.filter(
                    (Commandes) => statuts.includes(Commandes.statut) == true))]
                }), () => {
                  for (let i = 1; i <= Math.ceil(this.state.Commandes.length / this.state.annoncesPerPage); i++) {
                    pageNumbers.push(i);
                  }
                  this.setState((prevState, props) => ({
                    nombrePages: pageNumbers, CommandesN: this.state.Commandes, loading: false
                  }), () => { });
                });


              }
            );
          });

      }
    })
  }
  handelDelete(c) {
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: "Etes-vous sûr?",
      text: "Voulez-vous annuler votre commande!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "  Oui!  ",
      cancelButtonText: "  Non!  ",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            "http://127.0.0.1:8000/api/commande/" + c._id,
            {
              ancien_statut: c.statut,
              statut: "annulée manuellement",
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: myToken,
              },
            }
          )
          .then((res) => {
            c.especes.map((e) =>
            (
              axios
                .put(
                  "http://127.0.0.1:8000/api/Espece/" + e.id_espece,
                  {
                    statut: "disponible",
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": myToken,
                    },
                  }
                )
            ))

            if (!this.props.location.state.id.split("#").includes("annulée manuellement")) { this.setState({ Commandes: this.state.Commandes.filter((cmd) => cmd != c) }); }
            else {
              this.state.Commandes.filter((cmd) => cmd == c)[0].statut = "annulée manuellement"
              this.setState({ redirect: true, Commandes: this.state.Commandes });
            }

            swalWithBootstrapButtons.fire(
              'Annulation !',
              'Votre commande a bien été annulée',
              'success'
            )
          });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Annulation',
          'Commande non annulée !',
          'error'
        )
      }
    })
  }
  //nombre espece pour chaque categorie pour chaque commande
  NbrEspece(e, c) {
    let nombre = 0;
    nombre = e.espece.filter((e) => e.categorie == c).length
    return nombre;
  }
  //image selon les catégories des especes dans chaque commande 
  ImageEspece(e) {
    //une seule catégorie
    let image = e.espece[0].image_face;
    //mouton+vache+chevre
    if (this.NbrEspece(e, "mouton") != 0 && this.NbrEspece(e, "vache") != 0 && this.NbrEspece(e, "chevre") != 0) {
      image = "/Images/vachemoutonchevre.jpg"
    }
    //mouton+vache
    else if (this.NbrEspece(e, "mouton") != 0 && this.NbrEspece(e, "vache") != 0 && this.NbrEspece(e, "chevre") == 0) {
      image = "/Images/vachemouton.jpg"
    }
    //vache+chevre
    else if (this.NbrEspece(e, "mouton") == 0 && this.NbrEspece(e, "vache") != 0 && this.NbrEspece(e, "chevre") != 0) {
      image = "/Images/vachechevre.jpg"
    }
    //mouton+chevre
    else if (this.NbrEspece(e, "mouton") != 0 && this.NbrEspece(e, "vache") == 0 && this.NbrEspece(e, "chevre") != 0) {
      image = "/Images/moutonchevre.jpg"
    }
    return image;
  }
  //max poids max age
  Max(c, p) {
    let max = 0; let m = 0;
    p == "poids" ?
      c.espece.map((e) => {
        m = e.poids;
        max = max < m ? m : max;
      })
      :
      c.espece.map((e) => {
        m = e.age;
        max = max < m ? m : max;
      })
    return max;
  }
  //min poids max age
  Min(c, p) {
    let min = Number.MAX_VALUE; let m = 0;
    p == "poids" ? c.espece.map((e) => {
      m = e.poids;
      min = min > m ? m : min;
    })
      :
      c.espece.map((e) => {
        m = e.age;
        min = min > m ? m : min;
      })

    return min;
  }

  render() {

    const { loading } = this.state;
    const { optionsSort } = this.state;
    let AnnonceAll = [];
    let AnnonceA = [];
    this.state.Commandes.map((m)=>{
 if(m.statut=="avarié") {AnnonceAll.push(m)}
 else {AnnonceA.push(m)}
})

    const indexOfLastAnnonce =
      this.state.currentPage * this.state.annoncesPerPage;
    const indexOfFirstAnnonce = indexOfLastAnnonce - this.state.annoncesPerPage;
    const currentAnnonces = AnnonceAll.concat(AnnonceA).slice(indexOfFirstAnnonce, indexOfLastAnnonce);
    return (
      <div>
        <style>{`.scrollbar{  height: 200px;overflow-y: scroll;  }
 #style-scroll::-webkit-scrollbar{	width: 8px;	background-color: #F5F5F5;} #style-scroll::-webkit-scrollbar-thumb
{	border-radius: 10px; 	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);	background-color: #bbb;}`}</style>
        <section className="">
          {loading ? (
            <div
              style={{
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader
                type="Oval"
                color="#7fad39"
                height="80"
                width="80"
              />
            </div>
          ) : (
            <div className="container">
              <div>
                <div id="filterPlace" className="col-lg-5 col-md-5 fa mt-4 ">
                  <Select
                    id="filterPlace"
                    value={this.state.selectedOptionSort}
                    onChange={this.sortData}
                    options={optionsSort}
                    placeholder="&#xf161; Trier par"

                  />
                </div>
              </div>
              <br></br>
              <h4 class="latest-product__item">  Mes commandes : <span id="nbEspece">
                {" "}
                {this.state.Commandes.length}
              </span>{" "}</h4>
              <div className="row">
                <div className="col-lg-12 col-md-7">

                  <div class="row">
                    {currentAnnonces.map((Annonces) => (
                      <div className="col-lg-3 col-md-3 col-sm-6">

                        <div id="anonce" className="product__item">
                          <div className="product__item__pic set-bg" style={{height:"150px"}}
                          >
                            <centre>
                              {" "}
                              <img
                              style={{height:"150px"}}
                                src={this.ImageEspece(Annonces)}
                                className="product__item__pic set-bg"
                              />
                            </centre>

                            <ul class="product__item__pic__hover">
                              <li>
                                <Link
                                  to={{
                                    pathname: "/DetailsCommande",
                                    state: {
                                      id: Annonces,
                                    },
                                  }}
                                  type="submit" >
                                  {" "}
                                  <a href="#">
                                    {(Annonces.statut == "en attente de paiement avance" || Annonces.statut == "en attente de paiement du reste" || Annonces.statut === "en attente de paiement du complément") ?
                                      <CgFileAdd className="fa-lg" /> : <i class="fa fa-eye"></i>}
                                  </a>
                                </Link>
                              </li> 
                               {Annonces.statut === "commande annulée (deadline dépassé)"
                                || Annonces.statut === "reçu avance refusé"
                                || Annonces.statut === "reçu reste refusé"
                                || Annonces.statut === "en attente de paiement avance"
                                || Annonces.statut === "en attente de validation avance"
                                || Annonces.statut === "en attente de paiement du reste"
                                || (Annonces.statut === "avarié" && (Annonces.ancien_statut === "en attente de paiement avance" || Annonces.ancien_statut === "en attente de paiement du reste")) ? <li>
                                <a onClick={(e) => this.handelDelete(Annonces)} >
                                  <i className="fa fa-trash"></i>
                                </a>
                              </li> : null}
                            </ul>
                          </div>
                          <div id="style-scroll" className="scrollbar product__item__text p-2 text-justify" style={{ backgroundRepeat: "no-repeat", backgroundImage: Annonces.statut === "avarié" ? "linear-gradient(rgb(255,153,153), rgb(255,204,204))" : null, backgroundSize: "cover" }}>
                            <h6 id="mad">
                              {" "}
                              {"         " + Annonces.prix_total + "  Dhs"}
                            </h6>
                            <p   >
                              <h6 id="gras"> <GiSheep className=" mr-1 fa-lg " />Categories :</h6>
                              <h6>
                                {this.NbrEspece(Annonces, "mouton") != 0 ? <span>Mouton(s) :{this.NbrEspece(Annonces, "mouton")} </span> : null}
                              </h6>

                              <h6> {this.NbrEspece(Annonces, "chevre") != 0 ? <span>Chevre(s) :{this.NbrEspece(Annonces, "chevre")} </span> : null}
                              </h6><h6>{this.NbrEspece(Annonces, "vache") != 0 ? <span>Vache(s) :{this.NbrEspece(Annonces, "vache")} </span> : null}
                              </h6>
                            </p>

                            {Annonces.especes.length == 1 ? <p   >
                              <div class="d-inline-block  ">
                                {/**Commande normale  */}
                                <h6 id="gras">  <GiWeight className=" mr-1 fa-lg " />Poids :</h6>
                              </div>
                              <div class="d-sm-inline-block  ">
                                <span>{this.Max(Annonces, "poids")} Kg </span></div>
                            </p>
                              : <p>
                                {/**Commande multi espèces */}
                                <h6 id="gras">    <GiWeight className=" mr-1 fa-lg " />Poids :</h6>
                                <span>entre : {this.Max(Annonces, "poids")} Kg et {this.Min(Annonces, "poids")} Kg</span>
                              </p>}
                            {Annonces.especes.length == 1 ?
                              <div >
                                {/**Commande normale  */}
                                <div style={{ display: "inline-block" }}>
                                  <img style={{ width: "9%", marginRight: "3%", float: "left" }} src="./Images/age.png"></img>
                                  <h6>Age :  <span style={{ color: "#6f6f6f" }}>{this.Max(Annonces, "age")} mois</span></h6>
                                </div>
                              </div>
                              :
                              <p>
                                {/**Commande multi espèces */}
                                <h6 id="gras">
                                  <img style={{ width: "9%", marginRight: "3%" }} src="./Images/age.png"></img>Age :</h6>
                                <span>entre : {this.Max(Annonces, "age")} mois et {this.Min(Annonces, "age")} mois</span>
                              </p>}
                            {Annonces.reste_transmis_le != null && (Annonces.statut === "en attente de validation reste" || Annonces.statut === "validé") ? <div  ><p className="text-danger">reste transmis le : </p><p className="text-danger"> <i className="fa fa-calendar-o" aria-hidden="true"></i>{" "}{Annonces.reste_transmis_le}</p></div> : (
                              Annonces.avance_transmis_le != null && Annonces.statut === "en attente de validation avance" ? <div ><p className="text-danger">avance transmis le :</p> <p className="text-danger"> <i className="fa fa-calendar-o" aria-hidden="true"></i>{" "}{Annonces.avance_transmis_le}</p></div> : null
                            )}
                            {Annonces.avance_transmis_le == null && Annonces.statut === "en attente de paiement avance" ? <div  ><p className="text-danger">Dernier delai : </p><p className="text-danger"> <i className="fa fa-calendar-o" aria-hidden="true"></i>{" "}{Annonces.deadline.replace(",", " à ")}</p><p className="text-danger"><i className="fa fa-usd" aria-hidden="true"></i>{" "}Avance à payer  :  {Annonces.avance} Dhs</p></div> : (
                              Annonces.reste_transmis_le == null && Annonces.statut === "en attente de paiement du reste" ? <div ><p className="text-danger">Dernier delai :</p> <p className="text-danger"> <i className="fa fa-calendar-o" aria-hidden="true"></i>{" "}{Annonces.deadline.replace(",", " à ")}</p><p className="text-danger"><i className="fa fa-usd" aria-hidden="true"></i>{" "}Reste à payer :  {Annonces.reste} Dhs</p></div> : null
                            )}

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="center-div">
                    <nav className="row">
                      <ul className="pagination center-div">
                        {this.state.nombrePages.map((number) => (
                          <li key={number} className="page-item stylePagination">
                            <a onClick={() => this.paginate(number)} className="page-link">
                              {number}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )} </section>
      </div>
    );
  }
}

export default Commandes;
