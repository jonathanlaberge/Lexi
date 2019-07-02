<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
use Illuminate\Http\Response;

$router->get('/', function () use ($router)
{
    return $router->app->version();
});

$router->group(['prefix' => 'v1'], function () use ($router)
{
    $router->group(['prefix' => 'compte'], function () use ($router)
	{
		$router->post('connection', 'AccountController@Connection');
		$router->post('enregistrement', 'AccountController@Enregistrement');
		$router->post('mode', 'AccountController@Mode');
		$router->get('profil[/{idMaitresse:[0-9]+}]', 'AccountController@ProfilGet');
		$router->post('profil', 'AccountController@ProfilUpdate');
	});

    $router->group(['prefix' => 'admin'], function () use ($router)
	{
		$router->group(['prefix' => 'fiches'], function () use ($router)
		{
			$router->post('creation', 'AdminController@FicheCreation');
			$router->delete('{idCategorie:[0-9]+}/{idFiche:[0-9+]}', 'AdminController@FicheDelete');
			$router->get('{idCategorie:[0-9]+}/{idFiche:[0-9+]}', 'AdminController@FicheGet');
			$router->post('{idCategorie:[0-9]+}/{idFiche:[0-9+]}', 'AdminController@FicheSet');
			$router->get('liste[/{page:[0-9]+}]', 'AdminController@FicheGetList');
			$router->get('liste/{page:[0-9]+}/parcategorie/{idCategorie:[0-9]+}', 'AdminController@FicheGetListCategorie');
		});
		$router->group(['prefix' => 'categorie'], function () use ($router)
		{
			$router->post('creation', 'AdminController@CategorieCreation');
			$router->delete('{idCategorie:[0-9]+}', 'AdminController@CategorieDelete');
			$router->get('{idCategorie:[0-9]+}', 'AdminController@CategorieGet');
			$router->post('{idCategorie:[0-9]+}', 'AdminController@CategorieSet');
			$router->get('liste[/{page:[0-9]+}]', 'AdminController@CategorieGetList');
		});
		$router->group(['prefix' => 'eleve'], function () use ($router)
		{
			$router->post('creation', 'AdminController@UserCreation');
			$router->delete('{idEleve:[0-9]+}', 'AdminController@UserDelete');
			$router->get('{idEleve:[0-9]+}', 'AdminController@UserGet');
			$router->post('{idEleve:[0-9]+}', 'AdminController@UserSet');
			$router->get('liste[/{page:[0-9]+}]', 'AdminController@UserGetList');
			$router->get('{idEleve:[0-9]+}/listeafaire', 'AdminController@UserGetTODOList');
			$router->post('{idEleve:[0-9]+}/listeafaire', 'AdminController@UserSetTODOList');
		});
		$router->get('historique[/{page:[0-9]+}]', 'AdminController@Historique');
	});

    $router->group(['prefix' => 'eleve'], function () use ($router)
	{
		$router->group(['prefix' => 'fiches'], function () use ($router)
		{
			$router->post('validation', 'UserController@FicheValidation');
			$router->get('{idCategorie:[0-9]+}/{idFiche:[0-9]+}', 'UserController@FicheGet');
			$router->get('liste[/{page:[0-9]+}]', 'UserController@FicheGetList');
			$router->get('liste/{page:[0-9]+}/parcategorie/{idCategorie:[0-9]+}', 'UserController@FicheGetListCategorie');
			$router->get('historique[/{page:[0-9]+}]', 'UserController@Historique');
		});
		
	});
});
