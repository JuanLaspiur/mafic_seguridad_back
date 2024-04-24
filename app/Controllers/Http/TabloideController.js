'use strict'
const Tabloide = use("App/Models/Tabloide")
var randomize = require('randomatic')
const moment = require('moment')
moment.locale('es')
const Helpers = use('Helpers')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with Quedada
 */
  class TabloideController {
  /**
   * Show a list of all Quedada.
   * GET Quedada
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async tabloideAll ({ auth, request, response, view }) {
    try {
      let data = await Tabloide.all()
      response.send(data)
    } catch (error) {
      console.error('Tabloide by id: ' + error.name + ': ' + error.message);
    }
  }

  /**
   * Render a form to be used for creating a new Quedada.
   * GET tabloide/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new tabloide.
   * POST tabloide
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
/* async store ({ request, response, auth }) {
    let dat = request._body
    dat.status = 0
    const tabloide = await Tabloide.create(dat)
    response.send(tabloide)
  }*/
   async store ({ request, response, auth }) {
    try {
      let dat = request._body
      dat.status = 0
  
      // Verificar si el usuario proporcionó una posición válida
      if (dat.nro_posicion !== '1' && dat.nro_posicion !== '2') {
        return response.status(400).send({ message: "La posición debe ser '1' o '2' tipo String" });
      }
  
      const tabloide = await Tabloide.create(dat)
      return response.send(tabloide)
    } catch (error) {
      console.error('Error al crear el tabloide: ' + error.message);
      return response.status(500).send({ message: "Error al crear el tabloide." });
    }
  }  
  

  /**
   * Display a single Quedada.
   * GET Quedada/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }
  async tabloideById ({ params, request, response, view }) {
    try {
      let data = (await Tabloide.find(params.id))
      response.send(data)
    } catch (error) {
      console.error('Tabloide by id: ' + error.name + ': ' + error.message);
    }
  }
  /**
   * Render a form to update an existing Quedada.
   * GET Quedada/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  /**
   * Update Quedada details.
   * PUT or PATCH Quedada/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      let {name, img, redirect, description } = request._body
      let data = (await Tabloide.find(params.id))
      data.merge({name, description, redirect})
      let res = await data.save()
      response.send({message:'tabloide updated',tabloide:res})
    } catch (error) {
      console.error('Tabloide by id: ' + error.name + ': ' + error.message);
    }
  }

  async updateImg ({ request, response, params }) {
    var profilePic = request.file('files', {
      types: ['image'],
      size: '25mb'
    })
    if (profilePic) {
      if (Helpers.appRoot('storage/uploads/tabloide')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/tabloide'), {
          name: params.id.toString(),
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }

      if (!profilePic.moved()) {
        return profilePic.error()
      } else {
        response.send(true)
      }
    }
  }

  async addImg ({ request, response, params }) {
    let data = (await Tabloide.find(params.id))
    let codeFile = randomize('Aa0', 30)
    var profilePic = request.file('files', {
      types: ['image'],
      size: '25mb'
    })
    if (profilePic) {
      if (Helpers.appRoot('storage/uploads/tabloide')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/tabloide'), {
          name: codeFile,
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }

      if (!profilePic.moved()) {
        return profilePic.error()
      } else {
        if (data.img) {
          data.img = [codeFile]
        } else {
          data.img = [codeFile]
        }
        data.save()
        response.send(true)
      }
    }
  }

  /**
   * Delete a Quedada with id.
   * DELETE Quedada/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      let data = (await Tabloide.find(params.id))
      let res = await data.delete()
      response.send({message:'tabloide deleted',tabloide:res})
    } catch (error) {
      console.error('Tabloide by id: ' + error.name + ': ' + error.message);
    }
  }
    /**
   * Update a Tabloide View with id.
   * PUT Tabloide/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
    async clickOnTabloide ({params, request, response}) {
      const {id} = params
      try {
        let tabloide = await Tabloide.query().where('_id', id).fetch()
        tabloide = tabloide.first()
        if (!tabloide){
          return response.status(404).send({status: 404 , message: "Tabloide not Found in Database"})
        } else {
          if(!tabloide.clicks){
            await Tabloide.query().where('_id', id).update({ clicks: 1})
            return response.status(200).send({status: 200 , message: "Tabloide update success"})
          }else{
            await Tabloide.query().where('_id', id).update({ clicks: tabloide.clicks + 1})
            return response.status(200).send({status: 200 , message: "Tabloide update success"})
          }
        }
      } catch (error) {
        console.log(error)
        return response.status(500).send({status: 500 , message: "Server Error in Tabloide"})
      }
    }

    async upTabloide ({params, request, response}) {
      const {id} = params
      let allTabloides = await Tabloide.all()
      // Verifica que haya al menos dos tabloides en la base de datos
      if (allTabloides.rows.length < 2) {
        return;
      }

      return response.status(200).send({status: 200, message: "all tabloides"})
    }
}

module.exports = TabloideController
