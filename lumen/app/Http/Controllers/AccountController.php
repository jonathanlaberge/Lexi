<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use App\Model\Maitresse;

class AccountController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', ['only' =>
        [
            'ProfilGet',
            'ProfilUpdate',
            'Mode'
        ]]);
    }

    public function Connection(Request $request)
    {
		$body = json_decode($request->getContent());

        if(!isset($body->email, $body->motdepasse))
			return response()->json(['code' => 400 ,'message' => 'Invalid Parameter'], 400);


		$result = DB::select('SELECT * FROM `maitresse` WHERE email =?', [$body->email]);


        if($result == null || !password_verify($body->motdepasse, $result[0]->motdepasse))
			return response()->json(['code' => 401 ,'message' => 'Invalid Credentials'], 401);

		$user = new Maitresse();

		$user->idMaitresse = $result[0]->idMaitresse;
		$user->email = $result[0]->email;

		$user->prenom = $result[0]->prenom;
		$user->nom = $result[0]->nom;
		$user->dateNaissance = $result[0]->dateNaissance;
		$user->genre = $result[0]->genre;

        try
        {
            if (!$token = JWTAuth::fromUser($user))
                return response()->json(['code' => 401 ,'message' => 'Invalid Credentials'], 401);

        }
        catch (JWTException $e)
        {
            return response()->json(['code' => 500 ,'message' => 'Could Not Create Token'], 500);
        }


        return response()->json(["account" => $user, "token" => $token]);

    }

    public function Mode(Request $request)
    {
		$body = json_decode($request->getContent());

		if(isset($body->idEleveEnCours))
		{
			$returningToAdmin = false;
		}
		elseif(isset($body->motdepasse))
		{
			$returningToAdmin = true;
		}
		else
			return response()->json(['code' => 400 ,'message' => 'Invalid Parameter'], 400);

		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		$result = DB::select('SELECT * FROM `maitresse` WHERE `idMaitresse` =?', [$idMaitresse]);
		$user = new Maitresse();

        if($returningToAdmin)
		{
			if($result == null || !password_verify($body->motdepasse, $result[0]->motdepasse))
				return response()->json(['code' => 401 ,'message' => 'Invalid Credentials'], 401);

			$user->mode = "admin";
		}
		else
		{
            $resultEleve = DB::select('SELECT * FROM `classe_eleve_maitresse` WHERE `idMaitresse` =? AND `idEleve` =?', [$idMaitresse, $body->idEleveEnCours]);

            if($resultEleve == null)
				return response()->json(['code' => 401 ,'message' => 'Invalid Eleve'], 401);

			$user->mode = "user";
			$user->idEleveEnCours = $body->idEleveEnCours;
		}

		$user->idMaitresse = $result[0]->idMaitresse;
		$user->email = $result[0]->email;

		$user->prenom = $result[0]->prenom;
		$user->nom = $result[0]->nom;
		$user->dateNaissance = $result[0]->dateNaissance;
		$user->genre = $result[0]->genre;

        try
        {
            if (!$token = JWTAuth::fromUser($user))
                return response()->json(['code' => 401 ,'message' => 'Invalid Credentials'], 401);
        }
        catch (JWTException $e)
        {
            return response()->json(['code' => 500 ,'message' => 'Could Not Create Token'], 500);
        }


        return response()->json(["token" => $token]);

    }

    public function Enregistrement(Request $request)
    {
		$body = json_decode($request->getContent());

		if(!isset($body->email, $body->motdepasse, $body->prenom, $body->nom/*, $body->dateNaissance, $body->genre*/))
			return response()->json(['code' => 400 ,'message' => 'Invalid Parameter'], 400);

		$hashed = password_hash(
			$body->motdepasse,
			PASSWORD_ARGON2I,
			['memory_cost' => 2048, 'time_cost' => 6, 'threads' => 2]);

		DB::insert("
			INSERT INTO `maitresse`
			(`email`, `motdepasse`, `prenom`, `nom`)
			VALUES (?,?,?,?)",
			[$body->email, $hashed, $body->prenom, $body->nom]);

        if(isset($body->dateNaissance))
            DB::update('
                UPDATE `maitresse`
                SET `dateNaissance` =?
                WHERE `maitresse`.`idMaitresse` =?',
                [$body->dateNaissance,$idMaitresse]);

        if(isset($body->genre))
            DB::update('
                UPDATE `maitresse`
                SET `genre` =?
                WHERE `maitresse`.`idMaitresse` =?',
                [$body->genre,$idMaitresse]);

		return response()->json(['code' => 200 ,'message' => 'OK'] , 200);
	}

	public function ProfilGet(Request $request, $idMaitresse = null)
	{
		if ($idMaitresse != null)
		{
			$result = DB::select('
				SELECT `prenom`, `nom`
				FROM `maitresse`
				WHERE idMaitresse =?', [$idMaitresse]);
		}
		else
		{
			$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
			$result = DB::select('
				SELECT `idMaitresse`, `email`, `prenom`, `nom`, `dateNaissance`, `genre`
				FROM `maitresse`
				WHERE idMaitresse =?', [$idMaitresse]);
		}

		if($result == null)
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);

		return response()->json($result[0] , 200);
	}

    public function ProfilUpdate(Request $request)
    {
		$body = json_decode($request->getContent());

		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		$numberAffected = 0;

		try
		{
			DB::beginTransaction();
			if(isset($body->email))
			{
				$numberAffected++;
				DB::update('
					UPDATE `maitresse`
					SET `email` =?
					WHERE `maitresse`.`idMaitresse` =?',
					[$body->email,$idMaitresse]);
			}

			if(isset($body->motdepasse))
			{
				$numberAffected++;
				$hashed = password_hash(
					$body->motdepasse,
					PASSWORD_ARGON2I,
					['memory_cost' => 2048, 'time_cost' => 6, 'threads' => 2]);
				DB::update('
					UPDATE `maitresse`
					SET `motdepasse` =?
					WHERE `maitresse`.`idMaitresse` =?',
					[$hashed,$idMaitresse]);
			}

			if(isset($body->prenom))
			{
				$numberAffected++;
				DB::update('
					UPDATE `maitresse`
					SET `prenom` =?
					WHERE `maitresse`.`idMaitresse` =?',
					[$body->prenom,$idMaitresse]);
			}

			if(isset($body->nom))
			{
				$numberAffected++;
				DB::update('
					UPDATE `maitresse`
					SET `nom` =?
					WHERE `maitresse`.`idMaitresse` =?',
					[$body->nom,$idMaitresse]);
			}

			if(isset($body->dateNaissance))
			{
				$numberAffected++;
				DB::update('
					UPDATE `maitresse`
					SET `dateNaissance` =?
					WHERE `maitresse`.`idMaitresse` =?',
					[$body->dateNaissance,$idMaitresse]);
			}

			if(isset($body->genre))
			{
				$numberAffected++;
				DB::update('
					UPDATE `maitresse`
					SET `genre` =?
					WHERE `maitresse`.`idMaitresse` =?',
					[$body->genre,$idMaitresse]);
			}
			DB::commit();
		}
		catch (Exception $e)
		{
			DB::rollBack();
			return response()->json(['code' => 500 ,'message' => 'Could Not Update'], 500);
		}

		return response()->json(['code' => 200 ,'message' => $numberAffected.' Variable(s) Affected'] , 200);
    }
}
